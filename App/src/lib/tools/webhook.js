import fetch from "node-fetch";
import Store from "../../store/Store";

export default async function (body) {
  let url = Store.getWebhook();

  if (url == null) {
    return true;
  } else {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (res.status == [200, 201, 202, 203]) return true;
      })
      .catch(() => {
        return true;
      });
  }
}
