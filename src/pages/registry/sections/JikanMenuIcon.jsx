/**
 * [INPUT]: 依赖 react(useId/useState), @/lib/utils(cn)
 * [OUTPUT]: 对外提供 JikanMenuIcon 动画菜单图标组件
 * [POS]: registry/sections 的本地图标实现，保持原有悬停动效并避免编译期依赖 vendor docs 源码
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { useId, useState } from "react"
import { cn } from "@/lib/utils"

const MOTION_EASING = "cubic-bezier(0.4, 0, 0.2, 1)"

function getMotionClass(isHovered, idleClass, hoverClass, originClass = "origin-center-top") {
  return cn(originClass, "transition-all duration-800", isHovered ? hoverClass : idleClass)
}

function getMotionStyle(delaySeconds) {
  return {
    transitionTimingFunction: MOTION_EASING,
    transitionDelay: `${delaySeconds}s`,
  }
}

export function JikanMenuIcon({ className }) {
  const [isHovered, setIsHovered] = useState(false)
  const clipPathId = `registry-jikan-menu-icon-${useId().replace(/:/g, "")}`

  return (
    <div
      className={cn(
        "h-[19.8px] w-[20px] cursor-pointer overflow-visible",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg
        viewBox="0 0 108 107"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <defs>
          <clipPath id={clipPathId}>
            <rect x="0" y="0" width="108" height="107" />
          </clipPath>
        </defs>

        {/* ---- 主竖线：悬停后收起，保留 Kumo 原始“抽离”语义 ---- */}
        <path
          className={getMotionClass(
            isHovered,
            "translate-y-0 scale-y-100 opacity-100",
            "translate-y-[20px] scale-y-0 opacity-0",
          )}
          style={getMotionStyle(0.03)}
          d="M68.2631 0H76.8464V41.4044H68.2631V0Z"
          fill="currentColor"
        />

        {/* ---- 主内容层：右侧字符+左侧竖线，悬停时分层退场 ---- */}
        <g clipPath={`url(#${clipPathId})`}>
          <rect
            x="0"
            y="7.67627"
            width="8.13013"
            height="85.4326"
            className={getMotionClass(
              isHovered,
              "translate-y-0 scale-y-100 opacity-100",
              "translate-y-[22px] scale-y-0 opacity-0",
            )}
            style={getMotionStyle(0.02)}
            fill="currentColor"
          />
          <rect
            x="25.0414"
            y="7.67627"
            width="8.13013"
            height="76.5269"
            className={getMotionClass(
              isHovered,
              "translate-y-0 scale-y-100 opacity-100",
              "translate-y-[18px] scale-y-0 opacity-0",
            )}
            style={getMotionStyle(0.04)}
            fill="currentColor"
          />
          <path
            d="M33.1715 7.67627H0V15.585H33.1715V7.67627Z"
            className={getMotionClass(
              isHovered,
              "translate-y-0 scale-y-100 opacity-100",
              "translate-y-[12px] scale-y-[0.01] opacity-0",
            )}
            style={getMotionStyle(0.05)}
            fill="currentColor"
          />
          <path
            d="M33.1715 41.5205H0V49.4292H33.1715V41.5205Z"
            className={getMotionClass(
              isHovered,
              "translate-y-0 scale-y-100 opacity-100",
              "translate-y-[10px] scale-y-[0.01] opacity-0",
            )}
            style={getMotionStyle(0.07)}
            fill="currentColor"
          />
          <path
            d="M33.1715 76.2983H0V84.207H33.1715V76.2983Z"
            className={getMotionClass(
              isHovered,
              "translate-y-0 scale-y-100 opacity-100",
              "-translate-y-[12px] scale-y-[0.01] opacity-0",
            )}
            style={getMotionStyle(0.09)}
            fill="currentColor"
          />
          <path
            d="M37.1094 36.5195H108V44.4282H37.1094V36.5195Z"
            className={getMotionClass(
              isHovered,
              "translate-y-0 scale-y-100 opacity-100",
              "translate-y-[11px] scale-y-[0.01] opacity-0",
            )}
            style={getMotionStyle(0.06)}
            fill="currentColor"
          />
          <path
            d="M43.499 13.9565H101.61V17.8527V21.7489H43.499V13.9565Z"
            className={getMotionClass(
              isHovered,
              "translate-y-0 scale-y-100 opacity-100",
              "translate-y-[18px] scale-y-[0.01] opacity-0",
            )}
            style={getMotionStyle(0.08)}
            fill="currentColor"
          />
          <path
            d="M37.1094 57.4546H108V65.3633H37.1094V57.4546Z"
            className={getMotionClass(
              isHovered,
              "translate-y-0 scale-y-100 opacity-100",
              "-translate-y-[16px] scale-y-[0.01] opacity-0",
            )}
            style={getMotionStyle(0.1)}
            fill="currentColor"
          />
          <path
            d="M53.2422 69.4336L46.2827 73.5043C48.2159 75.5977 50.1491 77.885 52.0823 80.3662C54.0154 82.7698 55.7553 85.1735 57.3019 87.5771C58.9257 89.9032 60.163 92.0354 61.0136 93.9738L68.437 89.438C67.5864 87.4995 66.3105 85.3673 64.6093 83.0412C62.9854 80.7151 61.1682 78.3503 59.1577 75.9466C57.1472 73.543 55.1754 71.372 53.2422 69.4336Z"
            className={getMotionClass(
              isHovered,
              "translate-y-0 scale-y-100 opacity-100",
              "-translate-y-[44px] scale-y-[0.01] opacity-0",
            )}
            style={getMotionStyle(0.15)}
            fill="currentColor"
          />
          <path
            d="M83.1679 43.1489H91.7512V96.7652C91.7512 99.2464 91.4032 101.146 90.7073 102.464C90.0113 103.86 88.7741 104.868 86.9956 105.488C85.1397 106.186 82.7039 106.612 79.6881 106.767C76.6724 106.922 72.806 107 68.089 107C67.9344 105.837 67.5478 104.441 66.9291 102.813C66.3878 101.262 65.8079 99.9055 65.1893 98.7424C68.7463 98.8199 71.9941 98.8587 74.9325 98.8587C77.8709 98.9363 79.8041 98.9363 80.7321 98.8587C81.66 98.8587 82.2786 98.7036 82.5879 98.3935C82.9745 98.0834 83.1679 97.5018 83.1679 96.6489V43.1489Z"
            className={getMotionClass(
              isHovered,
              "translate-y-0 scale-y-100 opacity-100",
              "-translate-y-[58px] scale-y-[0.01] opacity-0",
            )}
            style={getMotionStyle(0.2)}
            fill="currentColor"
          />
        </g>

        {/* ---- 顶层菜单线：采用 Kumo 原版三横，默认隐藏，悬停显现 ---- */}
        <rect
          className={getMotionClass(
            isHovered,
            "translate-x-0 translate-y-0 scale-x-[0.94] opacity-0",
            "translate-x-[0.36px] translate-y-[24.88px] scale-x-100 opacity-100",
            "origin-left-center",
          )}
          style={getMotionStyle(0.14)}
          x="9.64014"
          y="0.120117"
          width="88"
          height="6"
          fill="currentColor"
        />
        <rect
          className={getMotionClass(
            isHovered,
            "translate-x-0 translate-y-0 scale-x-[0.94] opacity-0",
            "translate-x-[7.36px] translate-y-[30.88px] scale-x-[0.863] opacity-100",
            "origin-left-center",
          )}
          style={getMotionStyle(0.17)}
          x="2.64014"
          y="16.1201"
          width="102"
          height="6"
          fill="currentColor"
        />
        <rect
          className={getMotionClass(
            isHovered,
            "translate-x-0 translate-y-0 scale-x-[0.94] opacity-0",
            "translate-x-[9.36px] -translate-y-[5.12px] scale-x-[0.83] opacity-100",
            "origin-left-center",
          )}
          style={getMotionStyle(0.2)}
          x="0.640137"
          y="74.1201"
          width="106"
          height="6"
          fill="currentColor"
        />
      </svg>
    </div>
  )
}
