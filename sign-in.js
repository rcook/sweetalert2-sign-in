function initSweetAlert(go) {
  $.getScript("https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/7.19.2/sweetalert2.all.min.js", function() {
    window.sweetAlert2 = window.sweetAlert;
    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.0/sweetalert.min.js", go);
  });
}

function pause(millis)
{
  var date = new Date();
  var now = null;
  do {
    now = new Date();
  }
  while (now - date < millis);
}

var SignIn = (function() {
  var me = {};

  const USER_ID_ELEMENT_ID = "swal-input1-user-id";
  const PASSWORD_ELEMENT_ID = "swal-input2-password";

  function onKeyDown(e) {
    if (e.which == 13) {
      const userId = $(`#${USER_ID_ELEMENT_ID}`).val();
      const password = $(`#${PASSWORD_ELEMENT_ID}`).val();
      const validationResult = validate(userId, password);
      if (validationResult) {
        sweetAlert2.showValidationError(validationResult);
      }
      else {
        sweetAlert2.clickConfirm();
      }
    }
    else {
      sweetAlert2.resetValidationError();
    }
  }

  function validate(userId, password) {
    return !(userId.length > 0 && password.length > 0) && "User ID and password cannot empty";
  }

  function onPreConfirm() {
    const userId = $(`#${USER_ID_ELEMENT_ID}`).val();
    const password = $(`#${PASSWORD_ELEMENT_ID}`).val();
    return $.ajax({
      type: "POST",
      url: "http://httpbin.org/post",
      dataType: "json",
      data: { aaa: "AAA", bbb: "BBB" }
    }).then(function(result) {
      pause(2000);
      if (userId == password) {
        return { userId: userId, secretToken: "SOME-SECRET-TOKEN" };
      }
      else {
        sweetAlert2.showValidationError("You could not be signed in.");
        $(`#${USER_ID_ELEMENT_ID}`).focus();
      }
    });
  }

  me.signIn = function(go) {
    sweetAlert2({
      title: "Sign In",
      html:
        `<input id="${USER_ID_ELEMENT_ID}" class="swal2-input" placeholder="Enter your user name">` +
        `<input id="${PASSWORD_ELEMENT_ID}" class="swal2-input" placeholder="Enter your password" type="password">`,
      focusConfirm: false,
      showCancelButton: true,
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: onPreConfirm,
    }).then(function(result) {
      if (result.value) {
        go(result.value.userId, result.value.secretToken);
      }
    });
  };

  $(function() {
    $(document).on("keydown", `#${USER_ID_ELEMENT_ID},#${PASSWORD_ELEMENT_ID}`, onKeyDown);
  });

  return me;
}());
