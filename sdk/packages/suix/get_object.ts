import { getMoveObjectType, extractStructTag } from '@mysten/sui.js'
import { provider } from './common'

const obj1 = '0x60fe1e775818e21e95dd519fc12b83d3b5f041d1';
const obj2 = '0x791b32e1345c50c49ea1c75605ca8fd6f7217785';
const obj3 = '0xb3eeb3b6e7fe5112e7a807f25c72cd77335683d3';
const obj4 = '0xebb1c46dcf713baeb10e329a943e08ae4ceec916';

const logObject = async (objId: string) => {
  const res = await provider.getObject('0x882b9d35259b15e163df1bf53594d747a0c20aea')
  const type = getMoveObjectType(res);
  const structTag = extractStructTag(type);
  
  console.log(structTag)
};

(async () => {
  logObject(obj4);
})()
