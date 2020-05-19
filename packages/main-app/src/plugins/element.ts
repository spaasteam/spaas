/**
 * Created by levy on 2018/2/12.
 */
import Vue from "vue";
import "element-ui/lib/theme-chalk/index.css";

import {
  Button,
  Table,
  Pagination,
  TableColumn,
  Notification,
  Loading,
  Dialog,
  MessageBox,
  Message,
  Radio,
  RadioGroup,
  Checkbox,
  Switch,
  Form,
  FormItem,
  Input,
  Select,
  Option,
  DatePicker,
  Tooltip,
  Container,
  Main,
  Footer,
  Header,
  Menu,
  Submenu,
  MenuItem,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Row,
  Col,
  Aside,
  Tabs,
  TabPane,
  Card,
  Tree,
  Tag,
  Transfer,
  // @ts-ignore
  Scrollbar,
  Upload,
  Steps,
  Step,
  Drawer,
  CheckboxGroup,
  Breadcrumb,
  Cascader,
  TimePicker,
  BreadcrumbItem,
  InputNumber,
} from "element-ui";
Vue.prototype.$ELEMENT = { size: "small" };

Vue.use(TimePicker);
Vue.use(Drawer);
Vue.use(Upload);
Vue.use(Transfer);
Vue.use(Step);
Vue.use(Steps);
Vue.use(Button);
Vue.use(Select);
Vue.use(Option);
Vue.use(DatePicker);
Vue.use(Pagination);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Container);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Header);
Vue.use(Cascader);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Row);
Vue.use(Col);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Switch);
Vue.use(Loading.directive);
Vue.use(Dialog);
Vue.use(Tooltip);
Vue.use(Aside);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Card);
Vue.use(Tree);
Vue.use(Tag);
Vue.use(RadioGroup);
Vue.use(Scrollbar);
Vue.use(Drawer);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(CheckboxGroup);
Vue.use(InputNumber);

// Vue.use(Cascader)
// Vue.use(Autocomplete)

// steps
// Vue.use(Steps)
// Vue.use(Step)

Vue.prototype.$notify = Notification;

Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$message = Message;
