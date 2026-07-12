import { watch } from "vue";

const timers = {};

function save(key, value) {
    localStorage.setItem(
        key,
        JSON.stringify(value)
    );
}

// 防抖保存

function saveDelay(key, value, delay) {
    clearTimeout(timers[key]);
    timers[key] = setTimeout(() => {
        save(key, value);
    }, delay);
}



export function setupPersist(state, config) {
    Object.keys(config).forEach(field => {

        const option = config[field];

        // rare:
        // 完全不监听
        if (option.type === "rare") {
            return;
        }

        // frequent:
        // 修改立即保存
        if (option.type === "frequent") {
            watch(
                () => state[field],

                value => {
                    save(
                        option.key,
                        value
                    );
                }
            );
        }

        // burst:
        // 延迟保存
        if (option.type === "burst") {
            watch(
                () => state[field],
                value => {
                    saveDelay(
                        option.key,
                        value,
                        option.delay ?? 1000
                    );
                }
            );
        }
    });
}


export function updatePersistFields(state, values, config) {
    const result = {
        updated: [],
        skipped: [],
    };

    for (const [field, value] of Object.entries(values)) {
        const option = config[field];

        if (!option) {
            console.warn(`[persist] 字段 "${field}" 没有持久化配置`);
            result.skipped.push(field);
            continue;
        }

        // 先更新响应式状态
        state[field] = value;

        // frequent 和 burst 已有 watcher 负责保存
        if (option.type !== "rare") {
            result.updated.push(field);
            continue;
        }

        try {
            const storage = getStorage(option.storage);

            storage.setItem(
                option.key ?? field,
                JSON.stringify(value)
            );

            result.updated.push(field);
        } catch (error) {
            console.error(`[persist] 保存字段 "${field}" 失败`, error);
            result.skipped.push(field);
        }
    }
    return result;
}


export const persistConfig = {
    isLogined: {
        type: "rare",
        key: "isLogined",
        storage: "local",
    },

    isChangedColl: {
        type: "frequent",
        key: "isChangedColl",
        storage: "local",
    },

    userName: {
        type: "rare",
        key: "userName",
        storage: "local",
    },

    userId: {
        type: "rare",
        key: "userId",
        storage: "local",
    },

    userEmail: {
        type: "rare",
        key: "userEmail",
        storage: "local",
    },

    bio: {
        type: "rare",
        key: "bio",
        storage: "local",
    },

    userAccessToken: {
        type: "rare",
        key: "userAccessToken",
        storage: "local",
    },

    avatarUrl: {
        type: "rare",
        key: "avatarUrl",
        storage: "local",
    },

    level: {
        type: "frequent",
        key: "level",
        storage: "local",
    },

    xp: {
        type: "burst",
        key: "xp",
        storage: "local",
        delay: 500,
    },
};


