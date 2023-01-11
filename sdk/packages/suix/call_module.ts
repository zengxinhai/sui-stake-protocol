import { signer } from "./common";

export const callModule = async (pkgId: string, module: string, funcName: string, typeArgs: string[], args: any[]) => {
  return await signer.executeMoveCall({
    packageObjectId: pkgId,
    module,
    function: funcName,
    typeArguments: typeArgs,
    arguments: args,
    gasBudget: 1000000,
  });
}
