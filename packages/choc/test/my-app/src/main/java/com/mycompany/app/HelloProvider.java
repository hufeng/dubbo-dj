package com.mycompany.app;

public class HelloProvider extends ProviderBase
{
    public String sayHi( String[] args )
    {
        return "Hello World!";
    }

    private PersonDto _util() {
        return new PersonDto();
    }
}
