import "./index.scss";
import styles from "./index.module.scss";
import styled from "styled-components";
import reactLogo from "@/assets/icons/react.svg";
import viteLogo from "@/assets/imgs/vite.svg";
import { useEffect } from "react";
import MySvg from "@/assets/imgs/vite.svg?react";
import { version } from "../../../package.json";
import Worker from "./example.js?worker";

const Button = styled.button`
  width: 100px;
  color: white;
  background: skyblue;
`;

// 1. 初始化 Worker 实例
const worker = new Worker();
// 2. 主线程监听 worker 的信息
worker.addEventListener("message", (e) => {
  console.log(e);
});

export function Header() {
  useEffect(() => {
    const img = document.getElementById("logo") as HTMLImageElement;
    img.src = viteLogo;
  }, []);

  return (
    <div className="bg">
      <p className="header">CSS 预处理器</p>
      <p className={styles.bheader}>CSS Modules</p>
      <Button>CSS In JS 之 styled-components</Button>
      <p className="text-red-400">Tillwin css</p>
      <img src={reactLogo} alt="" />
      <img id="logo" className="mb-4" alt="" />
      <MySvg />
      <p className="text-red-600">
        Vite 中已经内置了对于 JSON 文件的解析，底层使用@rollup/pluginutils 的
        dataToEsm 方法将 JSON 对象转换为一个包含各种具名导出的 ES 模块，
        {version}
      </p>
      <div>
        图片资源生产环境域名替换：
        <img
          height={50}
          width={50}
          src={
            new URL(
              "../../assets/imgs/vite.svg",
              import.meta.env.VITE_IMG_BASE_URL
            ).href
          }
          alt=""
        />
      </div>
    </div>
  );
}
