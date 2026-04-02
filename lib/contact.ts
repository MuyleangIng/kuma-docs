export type ContactItem = {
  href: string;
  icon: string;
  label: string;
  external?: boolean;
};

export const CONTACT_ITEMS: ContactItem[] = [
  {
    href: "tel:+85500000000",
    icon: "☎",
    label: "Call",
  },
  {
    href: "mailto:support@example.com?subject=Koma%20Docs%20Support",
    icon: "✉",
    label: "Support",
  },
  {
    href: "https://t.me/MuyleangIng",
    icon: "✈",
    label: "Telegram",
    external: true,
  },
];
