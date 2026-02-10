#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
RUN_DIR="$ROOT_DIR/.run"
LOG_DIR="$RUN_DIR/logs"

mkdir -p "$LOG_DIR"

print_line() {
  printf '%s\n' "------------------------------------------------------------"
}

print_title() {
  clear || true
  print_line
  printf '%s\n' "$1"
  print_line
}

pause_and_exit() {
  printf '\n按回车键退出...'
  read -r _ || true
}

require_cmd() {
  local cmd="$1"
  local hint="$2"
  if ! command -v "$cmd" >/dev/null 2>&1; then
    printf '\n[错误] 未找到命令: %s\n%s\n' "$cmd" "$hint"
    pause_and_exit
    exit 1
  fi
}

require_node_version() {
  local node_major
  node_major="$(node -v | sed 's/^v//' | cut -d'.' -f1)"
  if [ "$node_major" -lt 20 ]; then
    printf '\n[错误] Node.js 版本过低，当前: %s\n请安装 Node.js 20 或更高版本后重试。\n' "$(node -v)"
    pause_and_exit
    exit 1
  fi
}

pnpm_exec() {
  (
    cd "$ROOT_DIR"
    CI=1 COREPACK_HOME=/tmp/corepack corepack pnpm "$@"
  )
}

prepare_pnpm() {
  COREPACK_HOME=/tmp/corepack corepack prepare pnpm@9.15.4 --activate >/dev/null 2>&1 || true
}

ensure_repo_manifest() {
  if [ ! -f "$ROOT_DIR/package.json" ]; then
    printf '\n[错误] 未找到项目根目录 package.json。\n'
    printf '当前脚本识别的项目目录是：%s\n' "$ROOT_DIR"
    printf '请确认你是在 ASRLLM 项目里运行脚本。\n'
    pause_and_exit
    exit 1
  fi
}

is_pid_running() {
  local pid="$1"
  if [ -z "$pid" ]; then
    return 1
  fi
  kill -0 "$pid" >/dev/null 2>&1
}

start_service() {
  local name="$1"
  local cmd="$2"
  local pid_file="$RUN_DIR/${name}.pid"
  local log_file="$LOG_DIR/${name}.log"

  nohup /bin/bash -lc "cd '$ROOT_DIR' && $cmd" < /dev/null >"$log_file" 2>&1 &
  local pid=$!
  echo "$pid" >"$pid_file"
  sleep 1

  if is_pid_running "$pid"; then
    printf '[已启动] %s (PID: %s)\n' "$name" "$pid"
  else
    printf '[失败] %s 启动失败，请查看日志: %s\n' "$name" "$log_file"
  fi
}

wait_http_ready() {
  local url="$1"
  local timeout_sec="${2:-20}"
  local elapsed=0

  while [ "$elapsed" -lt "$timeout_sec" ]; do
    if http_ok "$url"; then
      return 0
    fi
    sleep 1
    elapsed=$((elapsed + 1))
  done

  return 1
}

stop_service() {
  local name="$1"
  local pid_file="$RUN_DIR/${name}.pid"

  if [ ! -f "$pid_file" ]; then
    printf '[跳过] %s 未发现 PID 文件\n' "$name"
    return
  fi

  local pid
  pid="$(cat "$pid_file" 2>/dev/null || true)"

  if is_pid_running "$pid"; then
    pkill -TERM -P "$pid" >/dev/null 2>&1 || true
    kill -TERM "$pid" >/dev/null 2>&1 || true
    sleep 1
    if is_pid_running "$pid"; then
      kill -KILL "$pid" >/dev/null 2>&1 || true
    fi
    printf '[已停止] %s\n' "$name"
  else
    printf '[清理] %s 进程已不存在\n' "$name"
  fi

  rm -f "$pid_file"
}

http_ok() {
  local url="$1"
  local code
  code="$(curl -s -o /dev/null -w '%{http_code}' "$url" || true)"
  case "$code" in
    200|301|302|304)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

open_url() {
  local url="$1"
  if command -v open >/dev/null 2>&1; then
    open "$url" >/dev/null 2>&1 || true
    return
  fi
  if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$url" >/dev/null 2>&1 || true
  fi
}
