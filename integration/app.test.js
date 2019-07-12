const path = require("path");

describe("app", () => {
  beforeEach(async () => {
    await page.goto("http://localhost:3000");
  });

  it("should match a login button and a signup button", async () => {
    await expect(page).toMatchElement("#login-btn", { text: "Login" });
    await expect(page).toMatchElement("#signup-btn");
  });

  it("should be able to login", async () => {
    await expect(page).toClick("#login-btn", { text: "Login" });
    await page.waitForSelector("#login-modal");

    await expect(page).toFill("input#login-username", "test@test.com");
    await expect(page).toFill("input#login-password", "test@test.com");

    await expect(page).toClick("#toggle-login", { test: "Submit" });

    await page.waitForSelector("#login-user-email", { text: "test@test.com" });

    await expect(page).toMatchElement("#login-user-email", {
      text: "test@test.com"
    });
  });

  it("should be able to show list", async () => {
    setTimeout(async () => {
      await page.waitForSelector(".image-item");
      await expect(page).toMatchElement(".image-item");
    }, 5000);
  });

  it("should be able to upload image by url", async () => {
    const imageurl =
      "https://thejournal.com/~/media/EDU/THEJournal/Images/2015/02/20150224test644.jpg";
    // await page.waitForSelector('#searchInput')
    await expect(page).toFill("#searchInput", imageurl);
    await expect(page).toClick("#searchInputSubmit");

    // await page.waitForSelector('#login-user-email', { text: 'test@test.com' })
    setTimeout(async () => {
      await expect(page).toMatchElement('.img-item[src="' + imageurl + '"]');
    }, 10000);
  });

  // it('should match a button with a "Get Started" text inside', async () => {
  //   await expect(page).toMatchElement('.App-button', { text: 'Get Started' })
  // })

  // it('should match a input with a "textInput" name then fill it with text', async () => {
  //   await expect(page).toFill('input[name="textInput"]', 'James')
  // })

  // it('should match a form with a "myForm" name then fill its controls', async () => {
  //   await expect(page).toFillForm('form[name="testForm"]', {
  //     testOne: 'James',
  //     testTwo: 'Bond',
  //   })
  // })

  // it('should match a select with a "testSelect" name then select the specified option', async () => {
  //   await expect(page).toSelect('select[name="testSelect"]', 'Second Value')
  // })

  // it('should match a File Input with a "App-inputFile" class then fill it with a local file', async () => {
  //   await expect(page).toUploadFile(
  //     '.App-inputFile',
  //     path.join(__dirname, 'jest.config.js'),
  //   )
  // })
});
