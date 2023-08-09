import React, { FunctionComponent } from "react";
import { useEffect, useState } from "react";
import Flags from "svg-country-flags/countries.json";

export const Flag: FunctionComponent<
  { countryCode: string } & React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >
> = ({ countryCode, ...rest }) => {
  const [flag, setFlag] = useState();

  useEffect(() => {
    if (countryCode && countryCode.toUpperCase() in Flags) {
      import(`svg-country-flags/svg/${countryCode.toLowerCase()}.svg`)
        .then((flag) => setFlag(flag.default))
        .catch(() => setFlag(undefined));
    } else {
      setFlag(undefined);
    }
  }, [countryCode]);

  if (!flag) {
    return null;
  }

  return <img src={flag} alt={countryCode} {...rest} />;
};
