package cases;

import java.util.*;

public class ClassC<K, TB1 extends Date> extends BaseA<TB1> {
  TB1 fieldC;
  private HashMap<K, TB1> map;

  // (Ljava/util/Date;)V
  public void m1(TB1 arg) {
    fieldA = arg;
  }
}
