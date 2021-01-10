import * as path from "path";
import { Deserializer, ConstantValueAttr } from "../src";
import { LongInfo } from "../src/constant-pool";

(async () => {
  const dec = await Deserializer.fromFile(path.resolve(__dirname, "case1/ClassA.class"));
  const cf = dec.satisfy();
  console.log("Class: " + cf.name);

  console.log("SuperClass: " + cf.getSuperClass());

  console.log("Interfaces: " + cf.getInterfaces());

  console.log("\nfields(name|descriptor|signature):");
  cf.fields.forEach(f => console.log(`  ${f.name}  ${f.descriptor}  ${f.signature}`));
  console.log(
    cf.fields[0].attributes[0]
      .to(ConstantValueAttr)
      .getValue<LongInfo>()
      .number.toString()
  );

  console.log("\nmethods(name|descriptor|signature|formalParams):");
  cf.methods.forEach(m =>
    console.log(`  ${m.name}  ${m.descriptor}  ${m.signature}  ${m.formalParams}`)
  );
})();
