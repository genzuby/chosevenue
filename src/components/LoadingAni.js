import styled, { keyframes } from "styled-components";

const loadingCircle = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Loading = styled.div`
  margin: 10% auto;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: 1.1em solid rgba(255, 255, 255, 0.2);
  border-right: 1.1em solid rgba(255, 255, 255, 0.2);
  border-bottom: 1.1em solid rgba(255, 255, 255, 0.2);
  border-left: 1.1em solid #000;
  transform: translateZ(0);
  animation: ${loadingCircle} 1.1s infinite linear;
  border-radius: 50%;
  width: calc(6em + 4vw);
  height: calc(6em + 4vw);

  &:after {
    border-radius: 50%;
    width: calc(6em + 4vw);
    height: calc(6em + 4vw);
  }
`;

export default Loading;
