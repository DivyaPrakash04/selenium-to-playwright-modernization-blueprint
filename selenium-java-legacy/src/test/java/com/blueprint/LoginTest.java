package com.blueprint;

import org.openqa.selenium.By;
import org.testng.Assert;
import org.testng.annotations.Test;

public class LoginTest extends BaseTest {
    @Test
    public void standardUserCanLogIn() throws InterruptedException {
        driver.get("https://www.saucedemo.com/");
        // LEGACY SMELL #1: credentials are embedded in the test and timing uses a fixed sleep.
        driver.findElement(By.id("user-name")).sendKeys("standard_user");
        driver.findElement(By.id("password")).sendKeys("secret_sauce");
        driver.findElement(By.id("login-button")).click();
        Thread.sleep(1000);
        Assert.assertTrue(driver.getCurrentUrl().contains("inventory.html"));
        Assert.assertTrue(driver.findElement(By.className("title")).getText().contains("Products"));
    }
}
