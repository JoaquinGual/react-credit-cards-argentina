import creditCardType, { types as cardTypes } from "credit-card-type";
import luhn from "luhn";

import {  NaranjaAmex, NaranjaMaster, NaranjaVisa, galiciaMaster, galiciaVisa, laser, naranjaX, visaElectron } from "./cardTypes";

/**
 * Check if a credit card number is valid using the Luhn algorithm
 */
export const validateLuhn = luhn.validate;

/**
 * Given a credit card number in the format (XXXX XXXX XXXX...) return it as a string without any spaces
 */
export const sanitizeNumber = (number: string | number) =>
  number.toString().trim().replace(" ", "");

/**
 * Return the issuer of a given credit card number or `unknown` if the issuer can't be identified
 */
export const getCardType = (cardNumber: string | number) => {
  const potentialCardTypes = creditCardType(sanitizeNumber(cardNumber));

  if (potentialCardTypes.length === 1) {
    const firstResult = potentialCardTypes.shift();

    return firstResult?.type || "unknown";
  }

  return "unknown";
};

/**
 * Configure the credit card types supported and return an array of valid types
 */
export const setInitialValidCardTypes = () => {
  creditCardType.updateCard(cardTypes.MAESTRO, {
    patterns: [
      493698,
      [5000, 5018] as any,
      [502000, 506698],
      [506779, 508999],
      [56, 59],
      63,
      67,
      6,
    ],
  });

  creditCardType.updateCard(cardTypes.HIPERCARD, {
    patterns: [384100, 384140, 384160, 606282, 637095, 637568],
  });

  // creditCardType.addCard(dankort);
  creditCardType.addCard(laser);
  creditCardType.addCard(visaElectron);
  creditCardType.addCard(naranjaX);
  creditCardType.addCard(NaranjaVisa);
  creditCardType.addCard(NaranjaMaster);
  creditCardType.addCard(NaranjaAmex);
  creditCardType.addCard(galiciaMaster);
  creditCardType.addCard(galiciaVisa);

  

  return Object.values(cardTypes).concat([
    // "dankort",
    "naranja-x",
    "naranja-visa",
    "naranja-master",
    "naranja-amex",
    "laser",
    "visa-electron",
    "galicia-master",
    "galicia-visa"
    
  ] as any);
};

/**
 * Provides a map of patterns to match for some card types
 */
export const cardTypesMap = {
  amex: ["amex", "americanexpress", "american-express", "naranja-amex"],
  dinersclub: ["diners", "dinersclub", "diners-club"],
  visaelectron: ["visaelectron", "visa-electron"],
};
