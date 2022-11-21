import React from "react";

import { footerList1, footerList2, footerList3 } from "../utils/constants";

const FooterList = ({
  footerItems,
  mt,
}: {
  footerItems: string[];
  mt: boolean;
}) => (
  <div className={`flex flex-wrap gap-2 ${mt && "mt-5"}`}>
    {footerItems.map((footerItem) => (
      <p
        key={footerItem}
        className="text-gray-400 text-sm hover:underline cursor-pointer"
      >
        {footerItem}
      </p>
    ))}
  </div>
);

const Footer = () => {
  return (
    <div className="mt-6 hidden xl:block">
      <FooterList footerItems={footerList1} mt={false} />
      <FooterList footerItems={footerList2} mt />
      <FooterList footerItems={footerList3} mt />
      <p className="text-gray-400 text-sm mt-5">2022 VisiTok</p>
    </div>
  );
};

export default Footer;
