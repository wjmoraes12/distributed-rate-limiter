local key = KEYS[1]

local capacity = tonumber(ARGV[1])
local refillAmount = tonumber(ARGV[2])
local refillTimeMs = tonumber(ARGV[3])
local ttlSeconds = tonumber(ARGV[4])

if not capacity or capacity < 1 then
    return redis.error_reply("Invalid bucket capacity")
end

if not refillAmount or refillAmount < 1 then
    return redis.error_reply("Invalid refill amount")
end

if not refillTimeMs or refillTimeMs < 1 then
    return redis.error_reply("Invalid refill interval")
end

if not ttlSeconds or ttlSeconds < 0 then
    return redis.error_reply("Invalid TTL")
end

local time = redis.call("TIME")
local now = tonumber(time[1]) * 1000 + math.floor(tonumber(time[2]) / 1000)


local data = redis.call(
    "HMGET",
    key,
    "tokens",
    "updatedAt"
)

local tokens = tonumber(data[1])
local updatedAt = tonumber(data[2])

if not tokens or not updatedAt then
    tokens = capacity
    updatedAt = now
end

tokens = math.max(0, math.min(capacity, tokens))

local elapsed = math.max(0, now - updatedAt)
local intervals = math.floor(elapsed / refillTimeMs)

if intervals > 0 then
    tokens = math.min(
        capacity,
        tokens + intervals * refillAmount
    )

    updatedAt = updatedAt + intervals * refillTimeMs
end

if tokens >= capacity then
    updatedAt = now
end

local allowed = 0
local retryAfter = 0

if tokens >= 1 then
    tokens = tokens - 1
    allowed = 1
else
    retryAfter = math.max(0,refillTimeMs - (now - updatedAt))
end

redis.call(
    "HSET",
    key,
    "tokens", tokens,
    "updatedAt", updatedAt
)

if ttlSeconds > 0 then
    redis.call("EXPIRE", key, ttlSeconds)
end

return {
    allowed,
    tokens,
    retryAfter,
    updatedAt
}
