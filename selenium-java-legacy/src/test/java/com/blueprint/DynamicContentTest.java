package com.blueprint;

import org.openqa.selenium.By;
import org.testng.Assert;
import org.testng.annotations.Test;

public class DynamicContentTest extends BaseTest {
    @Test
    public void waitsForDynamicallyLoadedText() throws InterruptedException {
        driver.get("https://the-internet.herokuapp.com/dynamic_loading/2");
        driver.findElement(By.cssSelector("#start button")).click();
        // LEGACY SMELL #3: sleep-based polling wastes time and can still race the page.
        while (driver.findElements(By.id("finish")).isEmpty()) Thread.sleep(250);
        Assert.assertEquals(driver.findElement(By.cssSelector("#finish h4")).getText(), "Hello World!");
    }
}
