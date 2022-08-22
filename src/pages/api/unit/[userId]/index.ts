import type { NextApiRequest, NextApiResponse } from "next";
import { getAuthOpts, getUnitHeaders } from "pages/api/utils";
import { Profile } from "models/profile";

type DepositAccount = any;
type Data = any;
type Customer = any;

export async function getCustomer(userId: string) {
  const url = `${process.env.UNIT_API_URL}/customers?filter[tags]={"userId": "${userId}"}`;

  // TODO: should never return >1 user

  const request = {
    headers: getUnitHeaders()
  };

  const response = await fetch(url, request);
  const json = await response.json();
  return json.data[0] as Customer;
}

export async function createApprovedApplication(
  userId: string,
  profile: Profile
) {
  const url = `${process.env.UNIT_API_URL}/applications`;

  const request = {
    method: "POST",
    headers: getUnitHeaders(),
    body: JSON.stringify({
      data: {
        type: "individualApplication",
        attributes: {
          ssn: profile.ssn.replaceAll("-", ""),
          fullName: {
            first: profile.first_name,
            last: profile.last_name
          },
          dateOfBirth: profile.birth_date,
          address: {
            street: profile.address.line1,
            city: profile.address.city,
            state: profile.address.state,
            postalCode: profile.address.postal_code,
            country: profile.address.country
          },
          email: profile.email,
          phone: {
            countryCode: "1",
            number: profile.phone_number.substring(2)
          },
          tags: {
            userId
          }
        }
      }
    })
  };

  const response = await fetch(url, request);
  const json = await response.json();

  return json.data;
}

export async function createDepositAccount(
  customerId: string,
  purpose: string
) {
  const url = `${process.env.UNIT_API_URL}/accounts`;

  const request = {
    method: "POST",
    headers: getUnitHeaders(),
    body: JSON.stringify({
      data: {
        type: "depositAccount",
        attributes: {
          depositProduct: "checking",
          tags: {
            purpose: purpose
          }
        },
        relationships: {
          customer: {
            data: {
              type: "customer",
              id: customerId
            }
          }
        }
      }
    })
  };

  const response = await fetch(url, request);
  const json = await response.json();
  const result = json.data as DepositAccount;

  return result;
}

export async function getDepositAccounts(customerId: string) {
  const url = `${process.env.UNIT_API_URL}/accounts?filter[customerId]=${customerId}`;

  const request = {
    method: "GET",
    headers: getUnitHeaders()
  };
  const response = await fetch(url, request);
  const json = await response.json();

  const result = json.data as DepositAccount[];

  return result;
}

export async function encryptPayDistributionConfig(config: any) {
  const url = `${process.env.NEXT_PUBLIC_ARGYLE_BASE_URL}/pay-distribution-configs/encrypt`;

  const options = {
    ...getAuthOpts(),
    method: "POST",
    body: JSON.stringify(config)
  };

  try {
    const response = await fetch(url, options);
    const json = await response.json();

    return json.encrypted_config;
  } catch (error) {
    console.log(error);
  }
}

function getUser(userId: string) {
  const url = `${process.env.NEXT_PUBLIC_ARGYLE_BASE_URL}/accounts?user=${userId}`;

  return fetch(url, getAuthOpts())
    .then((response) => response.json())
    .then((data) => {
      return data.results;
    });
}

function getAccount(accountId: string) {
  const url = `${process.env.NEXT_PUBLIC_ARGYLE_BASE_URL}/profiles?account=${accountId}`;

  return fetch(url, getAuthOpts())
    .then((response) => response.json())
    .then((data) => {
      return data.results[0];
    });
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const userId = req.query.userId as string;

  getOrCreateCustomer(userId)
    .then((customer) => {
      getOrCreateBankAccounts(customer.id).then((depositAccounts) => {
        const checkingAccount = depositAccounts.find(
          (acc: any) => acc.attributes.tags.purpose === "checking"
        ) as DepositAccount;

        const savingsAccount = depositAccounts.find(
          (acc: any) => acc.attributes.tags.purpose === "saving"
        ) as DepositAccount;

        getEncryptedConfig(checkingAccount).then((encryptedConfig) => {
          const response = {
            customer,
            checkingAccount,
            savingsAccount,
            encryptedConfig
          };

          return res.json(response);
        });
      });
    })
    .catch((e) => {
      return res.json({ error: "Something went wrong with Unit flow" });
    });
}

function getOrCreateCustomer(userId: string) {
  return getCustomer(userId).then((customer) => {
    if (customer) {
      return customer;
    } else {
      return getUser(userId)
        .then((accounts) => {
          const accId = accounts[0].id;
          return getAccount(accId);
        })
        .then((profile) => {
          return createApprovedApplication(userId, profile);
        })
        .then(() => {
          return getCustomer(userId);
        })
        .then((customer) => customer);
    }
  });
}

function getOrCreateBankAccounts(customerId: string) {
  return getDepositAccounts(customerId).then((depositAccounts) => {
    if (depositAccounts.length > 0) {
      return depositAccounts;
    } else {
      const checking = createDepositAccount(customerId, "checking");
      const saving = createDepositAccount(customerId, "saving");

      return Promise.all([checking, saving]).then((depositAccounts) => {
        return depositAccounts;
      });
    }
  });
}

function getEncryptedConfig(depositAccount: DepositAccount) {
  const { routingNumber, accountNumber } = depositAccount.attributes;

  const config = {
    bank_account: {
      bank_name: "GoodLoans",
      routing_number: routingNumber,
      account_number: accountNumber,
      account_type: "checking"
    },
    allow_editing: false,
    entire_allocation: true,
    default_allocation_type: "percent"
  };

  return encryptPayDistributionConfig(config).then((encryptedConfig) => {
    return encryptedConfig;
  });
}
