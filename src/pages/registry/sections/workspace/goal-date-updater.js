/**
 * [INPUT]: 依赖 shared/wallpaper-core 的 ISO 校验与 Goal 日期约束
 * [OUTPUT]: 对外提供 applyGoalRangeUpdate、applyGoalStartUpdate、applyGoalDateUpdate 三个显式语义入口
 * [POS]: workspace Goal 日期状态层，统一验证流水线并保留历史错误语义兼容
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { isValidISODateString, validateGoalDateInputs } from "../../../../../shared/wallpaper-core.js"

function computeGoalErrors(goalStart, goalDate, todayISO) {
    return validateGoalDateInputs({
        goalStart,
        goalDate,
        todayISO,
    })
}

function applyGoalPatch(prev, patch, todayISO, mergePolicy) {
    const next = { ...prev, ...patch }
    const nextErrors = computeGoalErrors(next.goalStart, next.goalDate, todayISO)
    const shouldReject = typeof mergePolicy?.rejectWhen === "function" && mergePolicy.rejectWhen(nextErrors)

    if (shouldReject) {
        return mergePolicy.onReject(prev, nextErrors)
    }

    return {
        ...next,
        goalStartError: nextErrors.goalStartError,
        goalDateError: nextErrors.goalDateError,
    }
}

function applyGoalRangeUpdate(prev, { startISO, endISO, todayISO }) {
    return applyGoalPatch(prev, {
        goalStart: startISO || "",
        goalDate: endISO || "",
    }, todayISO)
}

function applyGoalStartUpdate(prev, { value, todayISO }) {
    if (!value) {
        return applyGoalPatch(prev, { goalStart: "" }, todayISO)
    }

    if (!isValidISODateString(value)) {
        return { ...prev, goalStartError: "error.goalStart.outOfRange" }
    }

    return applyGoalPatch(
        prev,
        { goalStart: value },
        todayISO,
        {
            rejectWhen: (errors) => Boolean(errors.goalStartError),
            onReject: (previous, errors) => ({
                ...previous,
                goalStartError: errors.goalStartError,
                goalDateError: errors.goalDateError || previous.goalDateError,
            }),
        }
    )
}

function applyGoalDateUpdate(prev, { value, todayISO }) {
    if (!value) {
        return applyGoalPatch(prev, { goalDate: "" }, todayISO)
    }

    if (!isValidISODateString(value)) {
        return { ...prev, goalDateError: "error.goalDate.outOfRange" }
    }

    return applyGoalPatch(
        prev,
        { goalDate: value },
        todayISO,
        {
            rejectWhen: (errors) => Boolean(errors.goalDateError),
            onReject: (previous, errors) => ({
                ...previous,
                goalStartError: errors.goalStartError || previous.goalStartError,
                goalDateError: errors.goalDateError,
            }),
        }
    )
}

export {
    applyGoalRangeUpdate,
    applyGoalStartUpdate,
    applyGoalDateUpdate,
}
