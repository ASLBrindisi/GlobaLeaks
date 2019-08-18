exports.receiver = function() {
  this.viewMostRecentSubmission = function() {
    return element(by.id("tip-0")).click();
  };

  this.addPublicKey = function(pgp_key_path) {
    browser.setLocation("/receiver/preferences");

    if (browser.gl.utils.testFileUpload()) {
      browser.gl.utils.fixUploadButtons();
      element(by.xpath("//input[@type='file']")).sendKeys(pgp_key_path).then(function() {
        return browser.waitForAngular();
      });
    } else {
      var fs = require("fs");
      var pgp_key = fs.readFileSync(pgp_key_path, {encoding: "utf8", flag: "r"});
      var pgpTxtArea = element(by.model("preferences.pgp_key_public"));
      pgpTxtArea.clear();
      pgpTxtArea.sendKeys(pgp_key);
    }

    return element.all(by.cssContainingText("span", "Save")).first().click();
  };

  this.wbfile_widget = function() {
    return element(by.css("#TipPageWBFileUpload"));
  };

  this.uploadWBFile = function(fname) {
    browser.gl.utils.fixUploadButtons();
    return element(by.xpath("//input[@type='file']")).sendKeys(fname).then(function() {
      return browser.waitForAngular();
    });
  };
};

exports.whistleblower = function() {
  this.performSubmission = function(title, uploadFiles) {
    browser.get("/#/submission");

    browser.gl.utils.waitUntilPresent(by.id("submissionForm"));

    browser.wait(function(){
      // Wait until the proof of work is resolved;
      return element(by.id("submissionForm")).evaluate("submission").then(function(submission) {
        return submission.pow === true;
      });
    }, browser.gl.utils.browserTimeout());

    element(by.id("step-receiver-selection")).element(by.id("receiver-0")).click();
    element(by.id("step-receiver-selection")).element(by.id("receiver-1")).click();
    element(by.id("NextStepButton")).click();
    element(by.id("step-0")).element(by.id("step-0-field-0-0-input-0")).sendKeys(title);
    element(by.id("step-0")).element(by.id("step-0-field-1-0-input-0")).sendKeys("x y z");

    if (uploadFiles && browser.gl.utils.testFileUpload()) {
      var fileToUpload1 = browser.gl.utils.makeTestFilePath("antani.txt");
      var fileToUpload2 = browser.gl.utils.makeTestFilePath("unknown.filetype");
      browser.gl.utils.fixUploadButtons();
      element(by.id("step-0")).element(by.id("step-0-field-2-0")).element(by.xpath("//input[@type='file']")).sendKeys(fileToUpload1).then(function() {
        browser.waitForAngular();
        element(by.id("step-0")).element(by.id("step-0-field-2-0")).element(by.xpath("//input[@type='file']")).sendKeys(fileToUpload2).then(function() {
          browser.waitForAngular();
        });
      });
    }

    var submit_button = element(by.id("SubmitButton"));
    var isClickable = protractor.ExpectedConditions.elementToBeClickable(submit_button);
    browser.wait(isClickable);
    submit_button.click();
    browser.gl.utils.waitForUrl("/receipt");
    return element(by.id("KeyCode")).getText();
  };

  this.submitFile = function(fname) {
    browser.gl.utils.fixUploadButtons();
    return element(by.xpath("//input[@type='file']")).sendKeys(fname).then(function() {
      return browser.waitForAngular();
    });
  };
};
