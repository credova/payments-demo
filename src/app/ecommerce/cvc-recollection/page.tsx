'use client';

import { useRef, useState } from 'react';
import {
  CardElement,
  CardVerificationCodeElement,
  PublicSquareProvider,
  usePublicSquare,
} from '@publicsquare/elements-react';
import PublicSquareTypes from '@publicsquare/elements-react/types';
import Button from '@/components/Button';

type SavedCard = { id: string; last4?: string; brand?: string };
type LogEntry = { at: string; step: string; ok: boolean; body: unknown };

const inputClass =
  'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm';

function Flow() {
  const { publicsquare } = usePublicSquare();
  const cardElement = useRef<PublicSquareTypes.CardElement>(null);
  const cvcElement = useRef<PublicSquareTypes.CardVerificationCodeElement>(null);

  const [nameOnCard, setNameOnCard] = useState('Test Shopper');
  const [amount, setAmount] = useState('1000');
  const [card, setCard] = useState<SavedCard>();
  const [busy, setBusy] = useState<string>();
  const [log, setLog] = useState<LogEntry[]>([]);

  function record(step: string, ok: boolean, body: unknown) {
    setLog((entries) => [{ at: new Date().toISOString(), step, ok, body }, ...entries]);
  }

  // Step 1: the merchant already has a saved card. Here we create one so the page is self-contained.
  async function saveCard() {
    if (!publicsquare || !cardElement.current || busy) return;
    setBusy('save');
    try {
      const res = await publicsquare.cards.create({
        cardholder_name: nameOnCard,
        card: cardElement.current,
      });
      if (res.error || !res.id) {
        record('save-card', false, res);
      } else {
        setCard({ id: res.id, last4: res.last4, brand: res.brand });
        record('save-card', true, { id: res.id, last4: res.last4, brand: res.brand });
      }
    } catch (error) {
      record('save-card', false, { error: String(error) });
    }
    setBusy(undefined);
  }

  // Step 2: the shopper re-enters the CVV. It goes from the iframe to Basis Theory, never to us.
  async function updateCvc() {
    if (!publicsquare || !cvcElement.current || !card || busy) return;
    setBusy('cvc');
    try {
      const res = await publicsquare.cards.updateCvc(card.id, cvcElement.current);
      record('update-cvc', !res.error, res);
    } catch (error) {
      record('update-cvc', false, { error: String(error) });
    }
    setBusy(undefined);
  }

  // Step 3: charge the saved card from the merchant's server. Charging again reuses the card
  // without a new updateCvc call, which is how we test decline-then-retry.
  async function charge() {
    if (!card || busy) return;
    setBusy('charge');
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(amount),
          payment_method: { card: card.id },
          customer: {
            first_name: 'Test',
            last_name: 'Shopper',
            email: 'test.shopper@example.com',
          },
          billing_details: {
            address_line_1: '111 Colorado Ave',
            city: 'Des Moines',
            state: 'IA',
            postal_code: '51111',
            country: 'US',
          },
        }),
      });
      const body = await res.json();
      // /api/payments always answers 200, so a failed charge is one without a payment id.
      record('charge', Boolean(body.id) && !body.error, { http_status: res.status, ...body });
    } catch (error) {
      record('charge', false, { error: String(error) });
    }
    setBusy(undefined);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-16 sm:px-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">CVV recollection</h1>
        <p className="mt-2 text-sm text-gray-500">
          Saved card, then a re-entered CVV attached with <code>cards.updateCvc()</code>, then a
          charge. Basis Theory keeps the CVC on the token for at most 24 hours.
        </p>
      </div>

      <section className="space-y-4 rounded-lg border p-6">
        <h2 className="font-semibold">1. Saved card</h2>
        {card ? (
          <p className="text-sm">
            <span className="uppercase">{card.brand}</span> ending in {card.last4} ·{' '}
            <code>{card.id}</code>
          </p>
        ) : (
          <>
            <label className="block text-sm font-medium text-gray-700">
              Name on card
              <input
                name="name_on_card"
                value={nameOnCard}
                onChange={(e) => setNameOnCard(e.target.value)}
                className={inputClass}
              />
            </label>
            <div className="rounded-md border border-gray-300 py-1">
              <CardElement ref={cardElement} id="card-element" />
            </div>
            <Button loading={busy === 'save'} onClick={saveCard}>
              Save card
            </Button>
          </>
        )}
      </section>

      <section className={`space-y-4 rounded-lg border p-6 ${card ? '' : 'opacity-50'}`}>
        <h2 className="font-semibold">2. Re-enter the CVV</h2>
        <div className="rounded-md border border-gray-300 py-1">
          <CardVerificationCodeElement ref={cvcElement} id="cvc-element" />
        </div>
        <Button disabled={!card} loading={busy === 'cvc'} onClick={updateCvc}>
          Update CVV
        </Button>
      </section>

      <section className={`space-y-4 rounded-lg border p-6 ${card ? '' : 'opacity-50'}`}>
        <h2 className="font-semibold">3. Charge</h2>
        <label className="block text-sm font-medium text-gray-700">
          Amount (cents)
          <input
            name="amount"
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={inputClass}
          />
        </label>
        <Button disabled={!card} loading={busy === 'charge'} onClick={charge}>
          Charge saved card
        </Button>
        <p className="text-xs text-gray-500">
          Press again after a decline to retry without updating the CVV.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">Event log</h2>
        <ol className="space-y-2">
          {log.map((entry, i) => (
            <li key={`${entry.at}-${i}`} className="rounded-md bg-gray-50 p-3 text-xs">
              <div className="font-medium">
                {entry.ok ? '✓' : '✗'} {entry.step} · {entry.at}
              </div>
              <pre className="mt-1 overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(entry.body, null, 2)}
              </pre>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

export default function Page() {
  return (
    <PublicSquareProvider
      apiKey={process.env.NEXT_PUBLIC_PUBLICSQUARE_API_KEY!}
      options={{ apiUrl: process.env.NEXT_PUBLIC_PUBLICSQUARE_API_URI! }}
    >
      <Flow />
    </PublicSquareProvider>
  );
}
