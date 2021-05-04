#!/usr/bin/env python3

import os
import psutil
import shutil
import signal
import subprocess
import time

sidecar_test_path = "sidecar-runtime-test"

def run_process(args):
    return subprocess.check_output(args, stderr=subprocess.STDOUT,
        encoding="utf-8")

def run_chain_test(chain):
    run_process(["yarn"])

    if chain == "polkadot":
        url = "wss://rpc.polkadot.io"
        chain = "polkadot"
    elif chain == "kusama":
        url = "wss://kusama-rpc.polkadot.io"
        chain = "kusama"
    else:
        return -1

    os.environ["SAS_SUBSTRATE_WS_URL"] = url
    proc = subprocess.Popen(["yarn", "dev"], stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT)

    time.sleep(10)

    os.chdir(sidecar_test_path)
    run_process(["yarn"])
    res = run_process(["yarn", "test", "--chain", chain])
    os.chdir("..")

    for child in psutil.Process(proc.pid).children(recursive=True):
        child.kill()
    proc.kill()

    print(res)
    return res.find("PASS")

def main():
    run_process(["git", "clone", "https://github.com/TarikGul/sidecar-runtime-test.git"])
    polka_test = run_chain_test("polkadot")
    kusama_test = run_chain_test("kusama")
    shutil.rmtree(sidecar_test_path)

    if polka_test == 0 and kusama_test == 0:
        return 0
    else:
        return -1

if __name__ == "__main__":
  main()
