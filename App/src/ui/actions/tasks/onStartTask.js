import Store from "./../../../store/Store";

import Adidas from "../../../modules/adidas/index";
import Amazon from "../../../modules/amazon/index";
import BestBuy from "../../../modules/bestbuy/index";
import FLX from "../../../modules/flx/index";
import Google from "../../../modules/google/index";
import Nike from "../../../modules/nike/index";
import Outlook from "../../../modules/outlook/phone";
import SNS from "../../../modules/sns/index";
import Shopify from "../../../modules/shopify/index";
import Ssense from "../../../modules/ssense/index";
import Target from "../../../modules/target/index";
import Walmart from "../../../modules/walmart/index";
import Crucial from "../../../modules/crucial/index";
import WaffleHouse from "../../../modules/wafflehouse/index";
import Checkers from "../../../modules/checkers/index";
import Cinnabon from "../../../modules/cinnabon";
import KrispyKreme from "../../../modules/krispykreme";

export default function (e, id) {
  console.log(`Start button clicked for task ${id}`);

  let tasks = Store.getTasks();
  const task = tasks[id];

  if (task && !task.running) {
    // There was definitely a better way to do this...
    switch (task.site.toLowerCase()) {
      case "amazon":
        new Amazon(task, task.id);
        break;
      case "adidas":
        new Adidas(task, task.id);
        break;
      case "bestbuy":
        new BestBuy(task, task.id);
        break;
      case "flx":
        new FLX(task, task.id);
        break;
      case "google":
        new Google(task, task.id);
        break;
      case "nike":
        new Nike(task, task.id);
        break;
      case "outlook":
        break;
      case "sns":
        new SNS(task, task.id);
        break;
      case "shopify":
        new Shopify(task, task.id);
        break;
      case "crucial":
        new Crucial(task, task.id);
        break;
      case "ssense":
        new Ssense(task, task.id);
        break;
      case "target":
        new Target(task, task.id);
        break;
      case "walmart":
        new Walmart(task, task.id);
        break;
      case "wafflehouse":
        new WaffleHouse(task, task.id);
        break;
      case "checkers":
        new Checkers(task, task.id);
        break;
      case "cinnabon":
        new Cinnabon(task, task.id);
        break;
      case "krispykreme":
        new KrispyKreme(task, task.id);
        break;
    }
  }
}
