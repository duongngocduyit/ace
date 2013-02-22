/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

if (typeof process !== "undefined") {
    require("amd-loader");
}

define(function(require, exports, module) {
"use strict";

var SnippetManager = require("./snippets").SnippetManager;
var assert = require("./test/assertions");

module.exports = {
    "test: textmate style format strings" : function() {
        var fmt = SnippetManager.tmStrFormat;
        assert.equal(fmt("abc", "/(.)(.)/$1/g"), "ac");
        assert.equal(fmt("abc", "/(.)(.)/$1(?2:Hello(1)2)/g"), "aHello(12)c2)");
        assert.equal(fmt("abc", "/(.)(.)/\\u$1+lL+\\u$2e|/g"), "A+lL+be|C+lL+e|");
        assert.equal(fmt("aBCD", "/(.)(.)/\\U$1+lL+\\l$2e/g"), "A+LL+be");
    },
    "test: parse snipmate file" : function() {
        var expected = [{
            name: "a",
            guard: "(?:(=)|(:))?s*)",
            trigger: "\\(?f",
            endTrigger: "\\)",
            endGuard: "\\)",
            content: "{$0}\n"
         }, {
            tabTrigger: "f",
            name: "function",
            content: "function"
        }];
        var parsed = SnippetManager.parseSnippetFile(
            "name a\nregex /(?:(=)|(:))?\s*)/\\(?f/\\)/\n\t{$0}" +
            "\n\t\n\n#function\nsnippet f function\n\tfunction"
        );
        
        assert.equal(JSON.stringify(expected), JSON.stringify(parsed))
    },
	"test: parse snippet": function() {
		var content = "-\\$$2a${1:x${$2:y$3}\\n\\}$TM_SELECTION}";
		var tokens = SnippetManager.tokenizeTmSnippet(content);
		assert.equal(tokens.length, 14);
		assert.equal(tokens[4] == tokens[13]);
		assert.equal(tokens[2].tabstopId == 2);

		var content = "\\}${var/as\\/d/\\ul\\//g:s}"
		var tokens = SnippetManager.tokenizeTmSnippet(content);
		assert.equal(tokens.length, 4);
		assert.equal(tokens[1], tokens[3]);
		assert.equal(tokens[2], "s");
		assert.equal(tokens[1].text, "var");
		assert.equal(tokens[1].fmt, "\\ul\\/");
		assert.equal(tokens[1].guard, "as\\/d");
		assert.equal(tokens[1].flag, "g");
	}
};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec()
}