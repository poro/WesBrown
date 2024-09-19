import React from 'react';

type ApiModelContextType = {
  apiModel: string;
  setApiModel: React.Dispatch<React.SetStateAction<string>>;
};

export const ApiModelContext = React.createContext<ApiModelContextType | undefined>(undefined);