create project using maven:

```bash
mvn archetype:generate \
  -DgroupId=com.mycompany.app \
  -DartifactId=my-app \
  -DarchetypeArtifactId=maven-archetype-quickstart \
  -DarchetypeVersion=1.4 \
  -DinteractiveMode=false \
  -DsocksProxyHost=127.0.0.1 \
  -DsocksProxyPort=8070
```

build project:

```bash
mvn package -DsocksProxyHost=127.0.0.1 -DsocksProxyPort=8070
```

run the built:

```bash
java -cp target/my-app-1.0-SNAPSHOT.jar com.mycompany.app.App
```

copy project dependencies into `PROJ_ROOT/target/dependency`:

```bash
mvn install dependency:copy-dependencies -DsocksProxyHost=127.0.0.1 -DsocksProxyPort=8070
```
