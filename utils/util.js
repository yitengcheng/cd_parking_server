/**
 * 通用工具函数
 */
const { result } = require("lodash");
const log4js = require("./log4");
const axios = require("axios");
const CODE = {
  SUCCESS: 200,
  PARAM_ERROR: 101, //参数错误
  USER_ACCOUNT_ERROR: 201, // 账号或密码错误
  USER_LOGIN_ERROR: 301, // 用户未登录
  BUSINESS_ERROR: 501, // 业务请求失败
  AUTH_ERROR: 401, // 认证失败或TOKEN过期
};
const mongoose = require("mongoose");

module.exports = {
  /**
   *
   * @param {number} pageNum
   * @param {number} pageSize
   * @returns
   */
  pager({ pageNum = 1, pageSize = 10 }) {
    pageNum *= 1;
    pageSize *= 1;
    const skipIndex = (pageNum - 1) * pageSize;
    return {
      page: {
        pageSize,
        pageNum,
      },
      skipIndex,
    };
  },
  success(data = "", msg = "", code = CODE.SUCCESS) {
    log4js.debug(data);
    return {
      code,
      msg,
      data,
    };
  },
  fail(stack, msg = "访问失败，请联系开发商", code = CODE.BUSINESS_ERROR) {
    log4js.debug(stack);
    return {
      code,
      msg,
    };
  },
  fuzzyQuery(fields, keyword) {
    const reg = new RegExp(keyword, "i");
    let query = [];
    fields.forEach((element) => {
      query.push({ [element]: { $regex: reg } });
    });
    return { $or: query };
  },
  schemaProperty(content) {
    let property = JSON.parse(content);
    let res = {};
    return new Promise((resolve) => {
      for (const item in property) {
        switch (property[item].type) {
          case "文字输入框":
            res[property[item].label] = String;
            break;
          case "数字输入框":
            res[property[item].label] = Number;
            break;
          case "多行文字输入框":
            res[property[item].label] = String;
            break;
          case "选择器":
            res[property[item].label] = String;
            break;
          case "单选框":
            res[property[item].label] = String;
            break;
          case "多选框":
            res[property[item].label] = [String];
            break;
          case "图片选择":
            res[property[item].label] = [String];
            break;
          case "日期选择":
            res[property[item].label] = String;
            break;
          case "日期范围选择":
            res[property[item].label] = [String];
            break;
          default:
            break;
        }
        resolve(res);
      }
    });
  },
  guzhangSchemaProperty(content) {
    let property = JSON.parse(content);
    let res = {};
    /**
     * 故障模板字段
     * reportUser：运维公司上报人员ID
     * assetsId: 资产ID
     * status： 故障状态 1 待处理 2 处理成功 3 拒绝处理
     * cc： 抄送给谁
     * oldDispose： 原处理者
     * dispose： 处理者
     * createTime: 创建时间
     * designateTime： 指派时间
     * phoneNumber: 联系方式
     * remark: 转单备注
     * conclusion: 处理情况
     * conclusionPhoto: 处理图片
     */
    return new Promise((resolve) => {
      for (const item in property) {
        switch (property[item].type) {
          case "文字输入框":
            res[property[item].label] = String;
            break;
          case "数字输入框":
            res[property[item].label] = Number;
            break;
          case "多行文字输入框":
            res[property[item].label] = String;
            break;
          case "选择器":
            res[property[item].label] = String;
            break;
          case "单选框":
            res[property[item].label] = String;
            break;
          case "多选框":
            res[property[item].label] = [String];
            break;
          case "图片选择":
            res[property[item].label] = [String];
            break;
          case "日期选择":
            res[property[item].label] = String;
            break;
          case "日期范围选择":
            res[property[item].label] = [String];
            break;
          default:
            break;
        }
        resolve({
          ...res,
          reportUser: mongoose.Types.ObjectId,
          assetsId: mongoose.Types.ObjectId,
          status: Number,
          cc: mongoose.Types.ObjectId,
          oldDispose: [mongoose.Types.ObjectId],
          dispose: mongoose.Types.ObjectId,
          createTime: String,
          designateTime: String,
          phoneNumber: String,
          remark: String,
          conclusion: String,
          conclusionPhoto: [String],
        });
      }
    });
  },
  schemaSelect(content) {
    let property = JSON.parse(content);
    let res = {};
    return new Promise((resolve) => {
      for (const item in property) {
        switch (property[item].type) {
          case "文字输入框":
            res[property[item].label] = 1;
            break;
          case "数字输入框":
            res[property[item].label] = 1;
            break;
          case "多行文字输入框":
            res[property[item].label] = 1;
            break;
          case "选择器":
            res[property[item].label] = 1;
            break;
          case "单选框":
            res[property[item].label] = 1;
            break;
          case "多选框":
            res[property[item].label] = 1;
            break;
          case "图片选择":
            res[property[item].label] = 1;
            break;
          case "日期选择":
            res[property[item].label] = 1;
            break;
          case "日期范围选择":
            res[property[item].label] = 1;
            break;
          default:
            break;
        }
        resolve(res);
      }
    });
  },
  async getAppletPhonenumber(code) {
    const getTokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxf40490ad0fe3246b&secret=fb186bd9419d53e191f9997b5af4190a`;
    const response = await axios.get(getTokenUrl);
    const { access_token } = response.data;
    const getPhonenumberUrl = `https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${access_token}`;
    const getPhonenumberOption = {
      code,
    };
    const resPhone = await axios.post(getPhonenumberUrl, getPhonenumberOption);
    return resPhone.data?.phone_info?.phoneNumber ?? "";
  },
  CODE,
};
