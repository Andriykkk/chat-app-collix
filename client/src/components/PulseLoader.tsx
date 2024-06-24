import React from "react";
import { Puff } from "react-loader-spinner";

const PulseLoader = () => {
  return (
    <Puff
      visible={true}
      height='80'
      width='80'
      color='rgb(243, 236, 204)'
      ariaLabel='puff-loading'
      wrapperStyle={{}}
      wrapperClass=''
    />
  );
};

export default PulseLoader;
