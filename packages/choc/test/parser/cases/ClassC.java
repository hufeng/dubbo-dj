package cases;

import java.util.*;

public class ClassC<K, TB1 extends Date> extends BaseA<TB1> {
  TB1 fieldC;
  private HashMap<K, TB1> map;

  public K m1(TB1 a, K b) {
    fieldA = a;
    return b;
  }
}
