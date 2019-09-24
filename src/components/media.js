import { css } from "styled-components";

const sizes = {
  pad: 1210,
  mobile: 580
};
const minsizes = {
  pad: 581,
  mobile: 1
};
// generate media query function
export default Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media only screen and (max-width: ${sizes[
        label
      ]}px) and (min-width: ${minsizes[label]}px) {
      ${css(...args)};
    }
  `;
  return acc;
}, {});
