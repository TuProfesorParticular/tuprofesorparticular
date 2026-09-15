import { describe, expect, it } from "vitest";
import {
  computePlatformFeeCents,
  getBasePrice,
  getDiscountedPrice,
  getFinalPrice,
  isFounderPriced,
  isInFounderFreeTrial,
  PLATFORM_FEE_PERCENT,
} from "./plans";

describe("computePlatformFeeCents", () => {
  it("retiene el porcentaje configurado de comisión", () => {
    expect(computePlatformFeeCents(10000)).toBe((10000 * PLATFORM_FEE_PERCENT) / 100);
  });

  it("redondea para que comisión + neto sumen exactamente el importe cobrado", () => {
    // 33,33€ es un caso propenso a errores de redondeo en céntimos.
    const amountCents = 3333;
    const fee = computePlatformFeeCents(amountCents);
    expect(Number.isInteger(fee)).toBe(true);
    expect(fee + (amountCents - fee)).toBe(amountCents);
  });

  it("no cobra comisión sobre un importe de 0", () => {
    expect(computePlatformFeeCents(0)).toBe(0);
  });
});

describe("precios de fundador", () => {
  const founder = { isFounder: true };
  const nonFounder = { isFounder: false };

  it("un fundador paga el precio fijo de fundador en Pro y Premium", () => {
    expect(getBasePrice("pro", founder)).toBeLessThan(getBasePrice("pro", nonFounder));
    expect(isFounderPriced("pro", founder)).toBe(true);
    expect(isFounderPriced("premium", founder)).toBe(true);
  });

  it("el plan free no tiene precio de fundador", () => {
    expect(isFounderPriced("free", founder)).toBe(false);
    expect(getBasePrice("free", founder)).toBe(0);
  });

  it("el descuento por materiales no se aplica sobre el precio de fundador", () => {
    const base = getBasePrice("pro", founder);
    expect(getFinalPrice("pro", founder, 5)).toBe(base);
  });

  it("el descuento por materiales sí se aplica a quien no es fundador", () => {
    const base = getBasePrice("pro", nonFounder);
    expect(getFinalPrice("pro", nonFounder, 1)).toBeLessThan(base);
    expect(getFinalPrice("pro", nonFounder, 0)).toBe(base);
  });
});

describe("getDiscountedPrice", () => {
  it("nunca baja de 0€ aunque el descuento supere el precio base", () => {
    expect(getDiscountedPrice(1, 1)).toBe(0);
  });
});

describe("isInFounderFreeTrial", () => {
  it("está en trial si founderProUntil es futuro y no hay suscripción de pago", () => {
    const future = new Date(Date.now() + 1000 * 60 * 60 * 24);
    expect(
      isInFounderFreeTrial({ founderProUntil: future, stripeSubscriptionId: null }),
    ).toBe(true);
  });

  it("deja de estar en trial si ya pasó la fecha", () => {
    const past = new Date(Date.now() - 1000 * 60 * 60 * 24);
    expect(
      isInFounderFreeTrial({ founderProUntil: past, stripeSubscriptionId: null }),
    ).toBe(false);
  });

  it("una suscripción de pago real anula el trial gratis, aunque no haya caducado", () => {
    const future = new Date(Date.now() + 1000 * 60 * 60 * 24);
    expect(
      isInFounderFreeTrial({ founderProUntil: future, stripeSubscriptionId: "sub_123" }),
    ).toBe(false);
  });

  it("sin founderProUntil no hay trial (recompensa de fundador ni de referidos)", () => {
    expect(
      isInFounderFreeTrial({ founderProUntil: null, stripeSubscriptionId: null }),
    ).toBe(false);
  });
});
