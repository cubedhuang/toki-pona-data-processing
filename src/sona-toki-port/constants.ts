import fs from 'fs';
// TypeScript equivalent of constants.py
import path from 'path';

import { LinkuUsageDate, LinkuWord } from './types';
import { findUnicodeChars } from './utils';

export const LATEST_DATE = '2024-09';

// Unicode Punctuation ranges
export const UNICODE_PUNCT_RANGES = [
	'\\u{00000021}-\\u{0000002f}',
	'\\u{0000003a}-\\u{00000040}',
	'\\u{0000005b}-\\u{00000060}',
	'\\u{0000007b}-\\u{0000007e}',
	'\\u{000000a1}-\\u{000000a8}',
	'\\u{000000ab}-\\u{000000ac}',
	'\\u{000000af}-\\u{000000b1}',
	'\\u{000000b4}',
	'\\u{000000b6}-\\u{000000b8}',
	'\\u{000000bb}',
	'\\u{000000bf}',
	'\\u{000000d7}',
	'\\u{000000f7}',
	'\\u{000002c2}-\\u{000002c5}',
	'\\u{000002d2}-\\u{000002df}',
	'\\u{000002e5}-\\u{000002eb}',
	'\\u{000002ed}',
	'\\u{000002ef}-\\u{000002ff}',
	'\\u{00000375}',
	'\\u{0000037e}',
	'\\u{00000384}-\\u{00000385}',
	'\\u{00000387}',
	'\\u{000003f6}',
	'\\u{00000482}',
	'\\u{0000055a}-\\u{0000055f}',
	'\\u{00000589}-\\u{0000058a}',
	'\\u{0000058d}-\\u{0000058f}',
	'\\u{000005be}',
	'\\u{000005c0}',
	'\\u{000005c3}',
	'\\u{000005c6}',
	'\\u{000005f3}-\\u{000005f4}',
	'\\u{00000606}-\\u{0000060f}',
	'\\u{0000061b}',
	'\\u{0000061d}-\\u{0000061f}',
	'\\u{0000066a}-\\u{0000066d}',
	'\\u{000006d4}',
	'\\u{000006de}',
	'\\u{000006e9}',
	'\\u{000006fd}-\\u{000006fe}',
	'\\u{00000700}-\\u{0000070d}',
	'\\u{000007f6}-\\u{000007f9}',
	'\\u{000007fe}-\\u{000007ff}',
	'\\u{00000830}-\\u{0000083e}',
	'\\u{0000085e}',
	'\\u{00000888}',
	'\\u{00000964}-\\u{00000965}',
	'\\u{00000970}',
	'\\u{000009f2}-\\u{000009f3}',
	'\\u{000009fa}-\\u{000009fb}',
	'\\u{000009fd}',
	'\\u{00000a76}',
	'\\u{00000af0}-\\u{00000af1}',
	'\\u{00000b70}',
	'\\u{00000bf3}-\\u{00000bfa}',
	'\\u{00000c77}',
	'\\u{00000c7f}',
	'\\u{00000c84}',
	'\\u{00000d4f}',
	'\\u{00000d79}',
	'\\u{00000df4}',
	'\\u{00000e3f}',
	'\\u{00000e4f}',
	'\\u{00000e5a}-\\u{00000e5b}',
	'\\u{00000f01}-\\u{00000f17}',
	'\\u{00000f1a}-\\u{00000f1f}',
	'\\u{00000f34}',
	'\\u{00000f36}',
	'\\u{00000f38}',
	'\\u{00000f3a}-\\u{00000f3d}',
	'\\u{00000f85}',
	'\\u{00000fbe}-\\u{00000fc5}',
	'\\u{00000fc7}-\\u{00000fcc}',
	'\\u{00000fce}-\\u{00000fda}',
	'\\u{0000104a}-\\u{0000104f}',
	'\\u{0000109e}-\\u{0000109f}',
	'\\u{000010fb}',
	'\\u{00001360}-\\u{00001368}',
	'\\u{00001390}-\\u{00001399}',
	'\\u{00001400}',
	'\\u{0000166d}-\\u{0000166e}',
	'\\u{0000169b}-\\u{0000169c}',
	'\\u{000016eb}-\\u{000016ed}',
	'\\u{00001735}-\\u{00001736}',
	'\\u{000017d4}-\\u{000017d6}',
	'\\u{000017d8}-\\u{000017db}',
	'\\u{00001800}-\\u{0000180a}',
	'\\u{00001940}',
	'\\u{00001944}-\\u{00001945}',
	'\\u{000019de}-\\u{000019ff}',
	'\\u{00001a1e}-\\u{00001a1f}',
	'\\u{00001aa0}-\\u{00001aa6}',
	'\\u{00001aa8}-\\u{00001aad}',
	'\\u{00001b4e}-\\u{00001b4f}',
	'\\u{00001b5a}-\\u{00001b6a}',
	'\\u{00001b74}-\\u{00001b7f}',
	'\\u{00001bfc}-\\u{00001bff}',
	'\\u{00001c3b}-\\u{00001c3f}',
	'\\u{00001c7e}-\\u{00001c7f}',
	'\\u{00001cc0}-\\u{00001cc7}',
	'\\u{00001cd3}',
	'\\u{00001fbd}',
	'\\u{00001fbf}-\\u{00001fc1}',
	'\\u{00001fcd}-\\u{00001fcf}',
	'\\u{00001fdd}-\\u{00001fdf}',
	'\\u{00001fed}-\\u{00001fef}',
	'\\u{00001ffd}-\\u{00001ffe}',
	'\\u{00002010}-\\u{00002027}',
	'\\u{00002030}-\\u{0000203b}',
	'\\u{0000203d}-\\u{00002048}',
	'\\u{0000204a}-\\u{0000205e}',
	'\\u{0000207a}-\\u{0000207e}',
	'\\u{0000208a}-\\u{0000208e}',
	'\\u{000020a0}-\\u{000020c0}',
	'\\u{00002100}-\\u{00002101}',
	'\\u{00002103}-\\u{00002106}',
	'\\u{00002108}-\\u{00002109}',
	'\\u{00002114}',
	'\\u{00002116}-\\u{00002118}',
	'\\u{0000211e}-\\u{00002121}',
	'\\u{00002123}',
	'\\u{00002125}',
	'\\u{00002127}',
	'\\u{00002129}',
	'\\u{0000212e}',
	'\\u{0000213a}-\\u{0000213b}',
	'\\u{00002140}-\\u{00002144}',
	'\\u{0000214a}-\\u{0000214d}',
	'\\u{0000214f}',
	'\\u{0000218a}-\\u{0000218b}',
	'\\u{00002190}-\\u{00002193}',
	'\\u{0000219a}-\\u{000021a8}',
	'\\u{000021ab}-\\u{00002319}',
	'\\u{0000231c}-\\u{00002327}',
	'\\u{00002329}-\\u{000023ce}',
	'\\u{000023d0}-\\u{000023e8}',
	'\\u{000023f4}-\\u{000023f7}',
	'\\u{000023fb}-\\u{00002429}',
	'\\u{00002440}-\\u{0000244a}',
	'\\u{0000249c}-\\u{000024c1}',
	'\\u{000024c3}-\\u{000024e9}',
	'\\u{00002500}-\\u{000025a9}',
	'\\u{000025ac}-\\u{000025b5}',
	'\\u{000025b7}-\\u{000025bf}',
	'\\u{000025c1}-\\u{000025fa}',
	'\\u{000025ff}',
	'\\u{00002605}-\\u{0000260d}',
	'\\u{0000260f}-\\u{00002610}',
	'\\u{00002612}-\\u{00002613}',
	'\\u{00002616}-\\u{00002617}',
	'\\u{00002619}-\\u{0000261c}',
	'\\u{0000261e}-\\u{0000261f}',
	'\\u{00002621}',
	'\\u{00002624}-\\u{00002625}',
	'\\u{00002627}-\\u{00002629}',
	'\\u{0000262b}-\\u{0000262d}',
	'\\u{00002630}-\\u{00002637}',
	'\\u{0000263b}-\\u{0000263f}',
	'\\u{00002641}',
	'\\u{00002643}-\\u{00002647}',
	'\\u{00002654}-\\u{0000265e}',
	'\\u{00002661}-\\u{00002662}',
	'\\u{00002664}',
	'\\u{00002667}',
	'\\u{00002669}-\\u{0000267a}',
	'\\u{0000267c}-\\u{0000267d}',
	'\\u{00002680}-\\u{00002691}',
	'\\u{00002698}',
	'\\u{0000269a}',
	'\\u{0000269d}-\\u{0000269f}',
	'\\u{000026a2}-\\u{000026a6}',
	'\\u{000026a8}-\\u{000026a9}',
	'\\u{000026ac}-\\u{000026af}',
	'\\u{000026b2}-\\u{000026bc}',
	'\\u{000026bf}-\\u{000026c3}',
	'\\u{000026c6}-\\u{000026c7}',
	'\\u{000026c9}-\\u{000026cd}',
	'\\u{000026d0}',
	'\\u{000026d2}',
	'\\u{000026d5}-\\u{000026e8}',
	'\\u{000026eb}-\\u{000026ef}',
	'\\u{000026f6}',
	'\\u{000026fb}-\\u{000026fc}',
	'\\u{000026fe}-\\u{00002701}',
	'\\u{00002703}-\\u{00002704}',
	'\\u{00002706}-\\u{00002707}',
	'\\u{0000270e}',
	'\\u{00002710}-\\u{00002711}',
	'\\u{00002713}',
	'\\u{00002715}',
	'\\u{00002717}-\\u{0000271c}',
	'\\u{0000271e}-\\u{00002720}',
	'\\u{00002722}-\\u{00002727}',
	'\\u{00002729}-\\u{00002732}',
	'\\u{00002735}-\\u{00002743}',
	'\\u{00002745}-\\u{00002746}',
	'\\u{00002748}-\\u{0000274b}',
	'\\u{0000274d}',
	'\\u{0000274f}-\\u{00002752}',
	'\\u{00002756}',
	'\\u{00002758}-\\u{00002762}',
	'\\u{00002765}-\\u{00002775}',
	'\\u{00002794}',
	'\\u{00002798}-\\u{000027a0}',
	'\\u{000027a2}-\\u{000027af}',
	'\\u{000027b1}-\\u{000027be}',
	'\\u{000027c0}-\\u{00002933}',
	'\\u{00002936}-\\u{00002b04}',
	'\\u{00002b08}-\\u{00002b1a}',
	'\\u{00002b1d}-\\u{00002b4f}',
	'\\u{00002b51}-\\u{00002b54}',
	'\\u{00002b56}-\\u{00002b73}',
	'\\u{00002b76}-\\u{00002b95}',
	'\\u{00002b97}-\\u{00002bff}',
	'\\u{00002ce5}-\\u{00002cea}',
	'\\u{00002cf9}-\\u{00002cfc}',
	'\\u{00002cfe}-\\u{00002cff}',
	'\\u{00002d70}',
	'\\u{00002e00}-\\u{00002e2e}',
	'\\u{00002e30}-\\u{00002e5d}',
	'\\u{00002e80}-\\u{00002e99}',
	'\\u{00002e9b}-\\u{00002ef3}',
	'\\u{00002f00}-\\u{00002fd5}',
	'\\u{00002ff0}-\\u{00002fff}',
	'\\u{00003001}-\\u{00003004}',
	'\\u{00003008}-\\u{00003020}',
	'\\u{00003036}-\\u{00003037}',
	'\\u{0000303e}-\\u{0000303f}',
	'\\u{0000309b}-\\u{0000309c}',
	'\\u{000030a0}',
	'\\u{000030fb}',
	'\\u{00003190}-\\u{00003191}',
	'\\u{00003196}-\\u{0000319f}',
	'\\u{000031c0}-\\u{000031e5}',
	'\\u{000031ef}',
	'\\u{00003200}-\\u{0000321e}',
	'\\u{0000322a}-\\u{00003247}',
	'\\u{00003250}',
	'\\u{00003260}-\\u{0000327f}',
	'\\u{0000328a}-\\u{00003296}',
	'\\u{00003298}',
	'\\u{0000329a}-\\u{000032b0}',
	'\\u{000032c0}-\\u{000033ff}',
	'\\u{00004dc0}-\\u{00004dff}',
	'\\u{0000a490}-\\u{0000a4c6}',
	'\\u{0000a4fe}-\\u{0000a4ff}',
	'\\u{0000a60d}-\\u{0000a60f}',
	'\\u{0000a673}',
	'\\u{0000a67e}',
	'\\u{0000a6f2}-\\u{0000a6f7}',
	'\\u{0000a700}-\\u{0000a716}',
	'\\u{0000a720}-\\u{0000a721}',
	'\\u{0000a789}-\\u{0000a78a}',
	'\\u{0000a828}-\\u{0000a82b}',
	'\\u{0000a836}-\\u{0000a839}',
	'\\u{0000a874}-\\u{0000a877}',
	'\\u{0000a8ce}-\\u{0000a8cf}',
	'\\u{0000a8f8}-\\u{0000a8fa}',
	'\\u{0000a8fc}',
	'\\u{0000a92e}-\\u{0000a92f}',
	'\\u{0000a95f}',
	'\\u{0000a9c1}-\\u{0000a9cd}',
	'\\u{0000a9de}-\\u{0000a9df}',
	'\\u{0000aa5c}-\\u{0000aa5f}',
	'\\u{0000aa77}-\\u{0000aa79}',
	'\\u{0000aade}-\\u{0000aadf}',
	'\\u{0000aaf0}-\\u{0000aaf1}',
	'\\u{0000ab5b}',
	'\\u{0000ab6a}-\\u{0000ab6b}',
	'\\u{0000abeb}',
	'\\u{0000fb29}',
	'\\u{0000fbb2}-\\u{0000fbc2}',
	'\\u{0000fd3e}-\\u{0000fd4f}',
	'\\u{0000fdcf}',
	'\\u{0000fdfc}-\\u{0000fdff}',
	'\\u{0000fe10}-\\u{0000fe19}',
	'\\u{0000fe30}-\\u{0000fe52}',
	'\\u{0000fe54}-\\u{0000fe66}',
	'\\u{0000fe68}-\\u{0000fe6b}',
	'\\u{0000ff01}-\\u{0000ff0f}',
	'\\u{0000ff1a}-\\u{0000ff20}',
	'\\u{0000ff3b}-\\u{0000ff40}',
	'\\u{0000ff5b}-\\u{0000ff65}',
	'\\u{0000ffe0}-\\u{0000ffe6}',
	'\\u{0000ffe8}-\\u{0000ffee}',
	'\\u{0000fffc}-\\u{0000fffd}',
	'\\u{00010100}-\\u{00010102}',
	'\\u{00010137}-\\u{0001013f}',
	'\\u{00010179}-\\u{00010189}',
	'\\u{0001018c}-\\u{0001018e}',
	'\\u{00010190}-\\u{0001019c}',
	'\\u{000101a0}',
	'\\u{000101d0}-\\u{000101fc}',
	'\\u{0001039f}',
	'\\u{000103d0}',
	'\\u{0001056f}',
	'\\u{00010857}',
	'\\u{00010877}-\\u{00010878}',
	'\\u{0001091f}',
	'\\u{0001093f}',
	'\\u{00010a50}-\\u{00010a58}',
	'\\u{00010a7f}',
	'\\u{00010ac8}',
	'\\u{00010af0}-\\u{00010af6}',
	'\\u{00010b39}-\\u{00010b3f}',
	'\\u{00010b99}-\\u{00010b9c}',
	'\\u{00010d6e}',
	'\\u{00010d8e}-\\u{00010d8f}',
	'\\u{00010ead}',
	'\\u{00010f55}-\\u{00010f59}',
	'\\u{00010f86}-\\u{00010f89}',
	'\\u{00011047}-\\u{0001104d}',
	'\\u{000110bb}-\\u{000110bc}',
	'\\u{000110be}-\\u{000110c1}',
	'\\u{00011140}-\\u{00011143}',
	'\\u{00011174}-\\u{00011175}',
	'\\u{000111c5}-\\u{000111c8}',
	'\\u{000111cd}',
	'\\u{000111db}',
	'\\u{000111dd}-\\u{000111df}',
	'\\u{00011238}-\\u{0001123d}',
	'\\u{000112a9}',
	'\\u{000113d4}-\\u{000113d5}',
	'\\u{000113d7}-\\u{000113d8}',
	'\\u{0001144b}-\\u{0001144f}',
	'\\u{0001145a}-\\u{0001145b}',
	'\\u{0001145d}',
	'\\u{000114c6}',
	'\\u{000115c1}-\\u{000115d7}',
	'\\u{00011641}-\\u{00011643}',
	'\\u{00011660}-\\u{0001166c}',
	'\\u{000116b9}',
	'\\u{0001173c}-\\u{0001173f}',
	'\\u{0001183b}',
	'\\u{00011944}-\\u{00011946}',
	'\\u{000119e2}',
	'\\u{00011a3f}-\\u{00011a46}',
	'\\u{00011a9a}-\\u{00011a9c}',
	'\\u{00011a9e}-\\u{00011aa2}',
	'\\u{00011b00}-\\u{00011b09}',
	'\\u{00011be1}',
	'\\u{00011c41}-\\u{00011c45}',
	'\\u{00011c70}-\\u{00011c71}',
	'\\u{00011ef7}-\\u{00011ef8}',
	'\\u{00011f43}-\\u{00011f4f}',
	'\\u{00011fd5}-\\u{00011ff1}',
	'\\u{00011fff}',
	'\\u{00012470}-\\u{00012474}',
	'\\u{00012ff1}-\\u{00012ff2}',
	'\\u{00016a6e}-\\u{00016a6f}',
	'\\u{00016af5}',
	'\\u{00016b37}-\\u{00016b3f}',
	'\\u{00016b44}-\\u{00016b45}',
	'\\u{00016d6d}-\\u{00016d6f}',
	'\\u{00016e97}-\\u{00016e9a}',
	'\\u{00016fe2}',
	'\\u{0001bc9c}',
	'\\u{0001bc9f}',
	'\\u{0001cc00}-\\u{0001ccef}',
	'\\u{0001cd00}-\\u{0001ceb3}',
	'\\u{0001cf50}-\\u{0001cfc3}',
	'\\u{0001d000}-\\u{0001d0f5}',
	'\\u{0001d100}-\\u{0001d126}',
	'\\u{0001d129}-\\u{0001d164}',
	'\\u{0001d16a}-\\u{0001d16c}',
	'\\u{0001d183}-\\u{0001d184}',
	'\\u{0001d18c}-\\u{0001d1a9}',
	'\\u{0001d1ae}-\\u{0001d1ea}',
	'\\u{0001d200}-\\u{0001d241}',
	'\\u{0001d245}',
	'\\u{0001d300}-\\u{0001d356}',
	'\\u{0001d6c1}',
	'\\u{0001d6db}',
	'\\u{0001d6fb}',
	'\\u{0001d715}',
	'\\u{0001d735}',
	'\\u{0001d74f}',
	'\\u{0001d76f}',
	'\\u{0001d789}',
	'\\u{0001d7a9}',
	'\\u{0001d7c3}',
	'\\u{0001d800}-\\u{0001d9ff}',
	'\\u{0001da37}-\\u{0001da3a}',
	'\\u{0001da6d}-\\u{0001da74}',
	'\\u{0001da76}-\\u{0001da83}',
	'\\u{0001da85}-\\u{0001da8b}',
	'\\u{0001e14f}',
	'\\u{0001e2ff}',
	'\\u{0001e5ff}',
	'\\u{0001e95e}-\\u{0001e95f}',
	'\\u{0001ecac}',
	'\\u{0001ecb0}',
	'\\u{0001ed2e}',
	'\\u{0001eef0}-\\u{0001eef1}',
	'\\u{0001f000}-\\u{0001f003}',
	'\\u{0001f005}-\\u{0001f02b}',
	'\\u{0001f030}-\\u{0001f093}',
	'\\u{0001f0a0}-\\u{0001f0ae}',
	'\\u{0001f0b1}-\\u{0001f0bf}',
	'\\u{0001f0c1}-\\u{0001f0ce}',
	'\\u{0001f0d1}-\\u{0001f0f5}',
	'\\u{0001f10d}-\\u{0001f16f}',
	'\\u{0001f172}-\\u{0001f17d}',
	'\\u{0001f180}-\\u{0001f18d}',
	'\\u{0001f18f}-\\u{0001f190}',
	'\\u{0001f19b}-\\u{0001f1ad}',
	'\\u{0001f1e6}-\\u{0001f1e7}',
	'\\u{0001f1ea}-\\u{0001f1eb}',
	'\\u{0001f1ee}-\\u{0001f1f1}',
	'\\u{0001f1f4}-\\u{0001f1f6}',
	'\\u{0001f1f9}-\\u{0001f200}',
	'\\u{0001f210}-\\u{0001f219}',
	'\\u{0001f21b}-\\u{0001f22e}',
	'\\u{0001f230}-\\u{0001f231}',
	'\\u{0001f23b}',
	'\\u{0001f240}-\\u{0001f248}',
	'\\u{0001f260}-\\u{0001f265}',
	'\\u{0001f322}-\\u{0001f323}',
	'\\u{0001f394}-\\u{0001f395}',
	'\\u{0001f398}',
	'\\u{0001f39c}-\\u{0001f39d}',
	'\\u{0001f3f1}-\\u{0001f3f2}',
	'\\u{0001f3f6}',
	'\\u{0001f4fe}',
	'\\u{0001f53e}-\\u{0001f548}',
	'\\u{0001f54f}',
	'\\u{0001f568}-\\u{0001f56e}',
	'\\u{0001f571}-\\u{0001f572}',
	'\\u{0001f57b}-\\u{0001f586}',
	'\\u{0001f588}-\\u{0001f589}',
	'\\u{0001f58e}-\\u{0001f58f}',
	'\\u{0001f591}-\\u{0001f594}',
	'\\u{0001f597}-\\u{0001f5a3}',
	'\\u{0001f5a6}-\\u{0001f5a7}',
	'\\u{0001f5a9}-\\u{0001f5b0}',
	'\\u{0001f5b3}-\\u{0001f5bb}',
	'\\u{0001f5bd}-\\u{0001f5c1}',
	'\\u{0001f5c5}-\\u{0001f5d0}',
	'\\u{0001f5d4}-\\u{0001f5db}',
	'\\u{0001f5df}-\\u{0001f5e0}',
	'\\u{0001f5e2}',
	'\\u{0001f5e4}-\\u{0001f5e7}',
	'\\u{0001f5e9}-\\u{0001f5ee}',
	'\\u{0001f5f0}-\\u{0001f5f2}',
	'\\u{0001f5f4}-\\u{0001f5f9}',
	'\\u{0001f650}-\\u{0001f67f}',
	'\\u{0001f6c6}-\\u{0001f6ca}',
	'\\u{0001f6d3}-\\u{0001f6d4}',
	'\\u{0001f6e6}-\\u{0001f6e8}',
	'\\u{0001f6ea}',
	'\\u{0001f6f1}-\\u{0001f6f2}',
	'\\u{0001f700}-\\u{0001f776}',
	'\\u{0001f77b}-\\u{0001f7d9}',
	'\\u{0001f800}-\\u{0001f80b}',
	'\\u{0001f810}-\\u{0001f847}',
	'\\u{0001f850}-\\u{0001f859}',
	'\\u{0001f860}-\\u{0001f887}',
	'\\u{0001f890}-\\u{0001f8ad}',
	'\\u{0001f8b0}-\\u{0001f8bb}',
	'\\u{0001f8c0}-\\u{0001f8c1}',
	'\\u{0001f900}-\\u{0001f90b}',
	'\\u{0001f93b}',
	'\\u{0001f946}',
	'\\u{0001fa00}-\\u{0001fa53}',
	'\\u{0001fa60}-\\u{0001fa6d}',
	'\\u{0001fb00}-\\u{0001fb92}',
	'\\u{0001fb94}-\\u{0001fbef}',
	'\\u{000f1990}-\\u{000f199d}'
];

export const UNICODE_PUNCT = findUnicodeChars(UNICODE_PUNCT_RANGES);

// POSIX Punctuation
export const POSIX_PUNCT = '-!"#$%&\'()*+,./:;<=>?@[\\]^_`{|}~';
export const POSIX_PUNCT_RANGES = [
	// Would be computed from POSIX_PUNCT
];

export const ALL_PUNCT = [...new Set([...POSIX_PUNCT, ...UNICODE_PUNCT])]
	.sort()
	.join('');
export const ALL_PUNCT_RANGES_STR = UNICODE_PUNCT_RANGES.join('');

export const UNICODE_WHITESPACE_RANGES = [
	'\\u{00000020}',
	'\\u{000000a0}',
	'\\u{00001680}',
	'\\u{00002000}-\\u{0000200a}',
	'\\u{00002028}-\\u{00002029}',
	'\\u{0000202f}',
	'\\u{0000205f}',
	'\\u{00003000}'
];
export const UNICODE_WHITESPACE = findUnicodeChars(UNICODE_WHITESPACE_RANGES);
export const UNICODE_WHITESPACE_RANGES_STR = UNICODE_WHITESPACE_RANGES.join('');

export const NOT_IN_PUNCT_CLASS = 'Ⓐ-ⓩ🄰-🅉🅐-🅩🅰-🆉';
export const ALL_VARIATION_SELECTOR_RANGES = [
	'\\u{0000fe00}-\\u{0000fe0f}',
	'\\u{000e0100}-\\u{000e01ef}'
];
export const EMOJI_VARIATION_SELECTOR_RANGES = ['\\u{0000fe0e}-\\u{0000fe0f}'];
export const EMOJI_VARIATION_SELECTOR_RANGES_STR =
	EMOJI_VARIATION_SELECTOR_RANGES.join('');

export const UCSUR_PUNCT_RANGES = ['\\u{000f1990}-\\u{000f199d}'];
export const UCSUR_PUNCT_RANGES_STR = UCSUR_PUNCT_RANGES.join('');

export const UCSUR_CARTOUCHE_LEFT = '󱦐';
export const UCSUR_CARTOUCHE_RIGHT = '󱦑';

// Sentence Punctuation
export const BASIC_SENTENCE_PUNCT = '.?!:;()[-]‽·•…';
export const QUOTATIVE_PUNCT = `"«»‹›""‟„⹂「」『』`;
export const UCSUR_SENTENCE_PUNCT = '󱦜󱦝';
export const ALL_SENTENCE_PUNCT = BASIC_SENTENCE_PUNCT + UCSUR_SENTENCE_PUNCT;

export const INTRA_WORD_PUNCT = "-''.";

// File paths
export const LINKU = path.join(__dirname, 'linku.json');
export const SANDBOX = path.join(__dirname, 'sandbox.json');
export const SYLLABICS = path.join(__dirname, 'syllabic.txt');
export const ALPHABETICS = path.join(__dirname, 'alphabetic.txt');

// Toki Pona alphabet
export const VOWELS = 'aeiou';
export const CONSONANTS = 'jklmnpstw';
export const ALPHABET = VOWELS + CONSONANTS;

// Allowable non-standard tokens
export const ALLOWABLES = new Set([
	'kxk', // ken ala ken
	'wxw', // wile ala wile
	'msa',
	'anusem'
]);

// False positives for syllabic filter
export const FALSE_POS_SYLLABIC = new Set([
	'like',
	'same',
	'nope',
	'uwu',
	'non',
	'owo',
	'one',
	'to',
	'i',
	'awesome',
	'use',
	'name',
	'time',
	'imo',
	'ime',
	'man',
	'joke',
	'so',
	'ten',
	'make',
	'pin',
	'note',
	'into',
	'in',
	'no',
	'some',
	'on',
	'me',
	'ipa',
	'sun',
	'mine',
	'sense',
	'none',
	'meme',
	'wise',
	'mon',
	'take',
	'luna',
	'elo',
	'japanese',
	'an',
	'anti',
	'win',
	'won',
	'we',
	'men',
	'ton',
	'woke',
	'sen',
	'se',
	'semi',
	'male',
	'woman',
	'line',
	'meta',
	'mini',
	'sine',
	'oposite',
	'anime',
	'potato',
	'japan',
	'nose',
	'kilo',
	'alone',
	'minute',
	'late',
	'women',
	'leson',
	'amen',
	'tote',
	'lame',
	'online',
	'tone',
	'ate',
	'mile',
	'melon',
	'tense',
	'nonsense',
	'nine',
	'emo',
	'unlike',
	'lone',
	'alike',
	'amuse',
	'animate',
	'antelope',
	'antena',
	'apetite',
	'asasin',
	'asasinate',
	'asinine',
	'asinine',
	'asume',
	'atone',
	'awake',
	'awaken',
	'eliminate',
	'elite',
	'emanate',
	'iluminate',
	'imense',
	'imitate',
	'inanimate',
	'injoke',
	'insane',
	'insolate',
	'insulate',
	'intense',
	'saluton',
	'lemon',
	'manipulate',
	'misuse',
	'ne',
	'tape',
	'onto',
	'wana',
	'muse'
]);

// False positives for alphabetic filter
export const FALSE_POS_ALPHABETIC = new Set([
	't',
	'is',
	'os',
	'as',
	'not',
	'link',
	'wait',
	'just',
	'lol',
	'new',
	'also',
	'isnt',
	'mean',
	'means',
	'it',
	'moment',
	'its',
	'lmao',
	'new',
	'wel',
	'makes',
	'unles'
]);

// UCSUR ranges
export const UCSUR_RANGES = [
	'\\u{000F1900}-\\u{000F1977}', // pu
	'\\u{000F1978}-\\u{000F1988}', // ku suli
	'\\u{000F19A0}-\\u{000F19A3}' // ku lili
];
export const NIMI_UCSUR = findUnicodeChars(UCSUR_RANGES);
export const ALL_UCSUR = NIMI_UCSUR + findUnicodeChars(UCSUR_PUNCT_RANGES);
export const UCSUR_MINUS_CARTOUCHE = new Set(ALL_UCSUR);
UCSUR_MINUS_CARTOUCHE.delete(UCSUR_CARTOUCHE_LEFT);
UCSUR_MINUS_CARTOUCHE.delete(UCSUR_CARTOUCHE_RIGHT);

export const NIMI_PU_SYNONYMS = new Set(['namako', 'kin', 'oko']);

/**
 * Load Linku data
 */
export function linkuData(): Record<string, LinkuWord> {
	try {
		const linku = JSON.parse(fs.readFileSync(LINKU, 'utf-8'));
		const sandbox = JSON.parse(fs.readFileSync(SANDBOX, 'utf-8'));
		return { ...linku, ...sandbox };
	} catch (error) {
		console.error('Error loading Linku data:', error);
		return {};
	}
}

/**
 * Get words by tag
 */
export function wordsByTag(tag: string, value: string): Set<string> {
	const data = linkuData();
	const result = new Set<string>();

	Object.values(data).forEach((d) => {
		if (d[tag] === value) {
			result.add(d.word);
		}
	});

	return result;
}

/**
 * Get words by usage
 */
export function wordsByUsage(
	usage: number,
	date?: LinkuUsageDate
): Set<string> {
	if (!date) {
		date = LATEST_DATE as LinkuUsageDate;
	}

	const data = linkuData();
	const result = new Set<string>();

	Object.values(data).forEach((word) => {
		if (usage === 0) {
			result.add(word.word);
			return;
		}

		const usages = word.usage;
		if (date in usages && usages[date] >= usage) {
			result.add(word.word);
		}
	});

	return result;
}
