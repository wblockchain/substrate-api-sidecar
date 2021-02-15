let imports = {};
imports['__wbindgen_placeholder__'] = module.exports;
let wasm;
const { TextDecoder } = require(String.raw`util`);

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let WASM_VECTOR_LEN = 0;

let cachegetNodeBufferMemory0 = null;
function getNodeBufferMemory0() {
    if (cachegetNodeBufferMemory0 === null || cachegetNodeBufferMemory0.buffer !== wasm.memory.buffer) {
        cachegetNodeBufferMemory0 = Buffer.from(wasm.memory.buffer);
    }
    return cachegetNodeBufferMemory0;
}

function passStringToWasm0(arg, malloc) {

    if (typeof(arg) !== 'string') throw new Error('expected a string argument');

    const len = Buffer.byteLength(arg);
    const ptr = malloc(len);
    getNodeBufferMemory0().write(arg, ptr, len);
    WASM_VECTOR_LEN = len;
    return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    if (typeof(heap_next) !== 'number') throw new Error('corrupt heap');

    heap[idx] = obj;
    return idx;
}

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

let stack_pointer = 32;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}

const u32CvtShim = new Uint32Array(2);

const uint64CvtShim = new BigUint64Array(u32CvtShim.buffer);

function _assertNum(n) {
    if (typeof(n) !== 'number') throw new Error('expected a number argument');
}

function _assertBoolean(n) {
    if (typeof(n) !== 'boolean') {
        throw new Error('expected a boolean argument');
    }
}

function logError(f) {
    return function () {
        try {
            return f.apply(this, arguments);

        } catch (e) {
            let error = (function () {
                try {
                    return e instanceof Error ? `${e.message}\n\nStack:\n${e.stack}` : e.toString();
                } catch(_) {
                    return "<failed to stringify thrown value>";
                }
            }());
            console.error("wasm-bindgen: imported JS function that was not marked as `catch` threw an error:", error);
            throw e;
        }
    };
}
/**
*/
class CalcFee {

    constructor() {
        throw new Error('cannot invoke `new` directly');
    }

    static __wrap(ptr) {
        const obj = Object.create(CalcFee.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_calcfee_free(ptr);
    }
    /**
    * @param {any} polynomial
    * @param {BigInt} extrinsic_base_weight
    * @param {string} multiplier
    * @param {string} per_byte_fee
    * @param {string} spec_name
    * @param {number} spec_version
    * @returns {CalcFee | undefined}
    */
    static from_params(polynomial, extrinsic_base_weight, multiplier, per_byte_fee, spec_name, spec_version) {
        try {
            uint64CvtShim[0] = extrinsic_base_weight;
            const low0 = u32CvtShim[0];
            const high0 = u32CvtShim[1];
            var ptr1 = passStringToWasm0(multiplier, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            var ptr2 = passStringToWasm0(per_byte_fee, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len2 = WASM_VECTOR_LEN;
            var ptr3 = passStringToWasm0(spec_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len3 = WASM_VECTOR_LEN;
            _assertNum(spec_version);
            var ret = wasm.calcfee_from_params(addBorrowedObject(polynomial), low0, high0, ptr1, len1, ptr2, len2, ptr3, len3, spec_version);
            return ret === 0 ? undefined : CalcFee.__wrap(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {BigInt} weight
    * @param {number} len
    * @returns {string}
    */
    calc_fee(weight, len) {
        try {
            if (this.ptr == 0) throw new Error('Attempt to use a moved value');
            const retptr = wasm.__wbindgen_export_2.value - 16;
            wasm.__wbindgen_export_2.value = retptr;
            _assertNum(this.ptr);
            uint64CvtShim[0] = weight;
            const low0 = u32CvtShim[0];
            const high0 = u32CvtShim[1];
            _assertNum(len);
            wasm.calcfee_calc_fee(retptr, this.ptr, low0, high0, len);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_export_2.value += 16;
            wasm.__wbindgen_free(r0, r1);
        }
    }
}
module.exports.CalcFee = CalcFee;
/**
*/
class CalcPayout {

    constructor() {
        throw new Error('cannot invoke `new` directly');
    }

    static __wrap(ptr) {
        const obj = Object.create(CalcPayout.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_calcpayout_free(ptr);
    }
    /**
    * @param {number} total_reward_points
    * @param {string} era_payout
    * @returns {CalcPayout}
    */
    static from_params(total_reward_points, era_payout) {
        _assertNum(total_reward_points);
        var ptr0 = passStringToWasm0(era_payout, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.calcpayout_from_params(total_reward_points, ptr0, len0);
        return CalcPayout.__wrap(ret);
    }
    /**
    * @param {number} validator_reward_points
    * @param {number} validator_commission
    * @param {string} nominator_exposure
    * @param {string} total_exposure
    * @param {boolean} is_validator
    * @returns {string}
    */
    calc_payout(validator_reward_points, validator_commission, nominator_exposure, total_exposure, is_validator) {
        try {
            if (this.ptr == 0) throw new Error('Attempt to use a moved value');
            const retptr = wasm.__wbindgen_export_2.value - 16;
            wasm.__wbindgen_export_2.value = retptr;
            _assertNum(this.ptr);
            _assertNum(validator_reward_points);
            _assertNum(validator_commission);
            var ptr0 = passStringToWasm0(nominator_exposure, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            var ptr1 = passStringToWasm0(total_exposure, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            _assertBoolean(is_validator);
            wasm.calcpayout_calc_payout(retptr, this.ptr, validator_reward_points, validator_commission, ptr0, len0, ptr1, len1, is_validator);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_export_2.value += 16;
            wasm.__wbindgen_free(r0, r1);
        }
    }
}
module.exports.CalcPayout = CalcPayout;

module.exports.__wbindgen_json_serialize = function(arg0, arg1) {
    const obj = getObject(arg1);
    var ret = JSON.stringify(obj === undefined ? null : obj);
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

module.exports.__wbindgen_string_new = function(arg0, arg1) {
    var ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

module.exports.__wbg_debug_ef2b78738889619f = logError(function(arg0) {
    console.debug(getObject(arg0));
});

module.exports.__wbg_error_7dcc755846c00ef7 = logError(function(arg0) {
    console.error(getObject(arg0));
});

module.exports.__wbg_info_43f70b84e943346e = logError(function(arg0) {
    console.info(getObject(arg0));
});

module.exports.__wbg_log_61ea781bd002cc41 = logError(function(arg0) {
    console.log(getObject(arg0));
});

module.exports.__wbg_warn_502e53bc79de489a = logError(function(arg0) {
    console.warn(getObject(arg0));
});

module.exports.__wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
};

module.exports.__wbg_error_4bb6c2a97407129a = logError(function(arg0, arg1) {
    try {
        console.error(getStringFromWasm0(arg0, arg1));
    } finally {
        wasm.__wbindgen_free(arg0, arg1);
    }
});

module.exports.__wbg_new_59cb74e423758ede = logError(function() {
    var ret = new Error();
    return addHeapObject(ret);
});

module.exports.__wbg_stack_558ba5917b466edd = logError(function(arg0, arg1) {
    var ret = getObject(arg1).stack;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
});

module.exports.__wbindgen_debug_string = function(arg0, arg1) {
    var ret = debugString(getObject(arg1));
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

module.exports.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

const path = require('path').join(__dirname, 'calc_bg.wasm');
const bytes = require('fs').readFileSync(path);

const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
wasm = wasmInstance.exports;
module.exports.__wasm = wasm;

