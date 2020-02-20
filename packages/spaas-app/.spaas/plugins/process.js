// 流程相关枚举
const ConfigTypeEnum = [
  {
    label: '表单',
    value: 1,
  },
  {
    label: '网络文件资源',
    value: 2,
  },
  {
    label: '本地文件资源',
    value: 3,
  },
];
const StatusEnum = [
  {
    label: '草稿',
    value: 1,
  },
  {
    label: '可用',
    value: 2,
  },
  {
    label: '禁用',
    value: 3,
  },
];
// 运行状态枚举
const runningStatus = [
  {
    label: '已禁用',
    value: 1,
    color: '#F5222D',
  },
  {
    label: '进行中',
    value: 2,
    color: '#1890FF',
  },
  {
    label: '未生效',
    value: 3,
    color: '#BFBFBF',
  },
];
// 节点相关枚举
const NodeTypeEnum = [
  {
    label: '开始',
    value: 0,
  },
  {
    label: '结束',
    value: 1,
  },
  {
    label: '任务',
    value: 2,
  },
  {
    label: '判断',
    value: 3,
  },
  {
    label: '网关',
    value: 4,
  },
];
// 节点任务枚举
const NodeTaskTypeEnum = [
  {
    label: 'HTTP调用',
    value: 1,
  },
  {
    label: 'springBean调用',
    value: 2,
  },
  // TODO: 暂时先去掉 2019-07-02
  // {
  //   label: 'dubbo远程调用',
  //   value: 3,
  // },
];
const NodeTaskHttpMethodEnum = [
  {
    label: 'GET',
    value: 1,
  },
  {
    label: 'POST',
    value: 2,
  },
  {
    label: 'PUT',
    value: 3,
  },
  {
    label: 'DELETE',
    value: 4,
  },
];
// 流程执行状态枚举
const ProcessActionEnum = [
  {
    label: '运行中',
    value: 0,
  },
  {
    label: '已完成',
    value: 1,
  },
];

const ProcessInstanceStatus = [
  {
    label: '可用',
    value: 0,
  },
  {
    label: '禁用',
    value: 1,
  },
];

const ProcessNodeStatus = [
  {
    label: '初始化',
    value: 0,
  },
  {
    label: '成功，后续节点已初始化',
    value: 1,
  },
  {
    label: '失败',
    value: 2,
  },
  {
    label: '成功，后续节点未初始化',
    value: 3,
  },
  {
    label: '驳回',
    value: 4,
  },
  {
    label: '重审',
    value: 5,
  },
  {
    label: '待重审',
    value: 6,
  },
  {
    label: '已重审',
    value: 7,
  },
  {
    label: '重审失败',
    value: 8,
  },
];
const ProcessNodeActionType = [
  {
    label: '自动执行',
    value: 0,
  },
  {
    label: '手动执行',
    value: 1,
  },
];

const ProcessLinkLogStatus = [
  {
    label: '通过',
    value: 0,
  },
  {
    label: '不通过',
    value: 1,
  },
];
const ProcessNodeTaskLogStatus = [
  {
    label: '运行中',
    value: 0,
  },
  {
    label: '成功',
    value: 1,
  },
  {
    label: '失败',
    value: 2,
  },
];

export const ProcessAuthGroupType = [
  {
    label: '部门',
    value: 1,
  },
  {
    label: '角色',
    value: 2,
  },
  {
    label: '用户',
    value: 3,
  },
];

export default {
  ConfigTypeEnum,
  StatusEnum,
  NodeTypeEnum,
  NodeTaskTypeEnum,
  NodeTaskHttpMethodEnum,
  runningStatus,
  ProcessActionEnum,
  ProcessInstanceStatus,
  ProcessNodeStatus,
  ProcessLinkLogStatus,
  ProcessNodeActionType,
  ProcessNodeTaskLogStatus,
  ProcessAuthGroupType,
};
