/* Usage:

    <span lang="sa">raamaayaNaha</span>
    <span lang="ta">thamizh</span>

    <script src="transliterate.js"></script>
    <script>transliterate(document.body)</script>

*/

var transliterate = function(node, lang) {
    if (node) {
        lang = lang || transliterate.parentLang(node);
        lang = lang.substr(0,2).toLowerCase();              // First two letters contain the main language
        var type = node.nodeType;
        if (type == 3) {                                    // Replace only text nodes
            var trans = transliterate.lang[lang];           // Store transliterators in transliterate.lang['ta'], transliterate.lang['sa'], etc.
            if (typeof trans == "function") { try {
                node.nodeValue = trans(node.nodeValue);
            } catch(e) { } }                                // Ignore exceptions
        }
        else {                                              // Walk through the children of all other nodes
            var children = node.childNodes;
            for (var i=0, l=children.length; i<l; i++) {
                var newnode = children[i];
                var newlang = newnode.lang || lang;
                transliterate(newnode, newlang);
            }
        }
    }
};

transliterate.parentLang = function(node) {
    if (node.lang)              { return node.lang; }
    else if (node.parentNode)   { return transliterate.parentLang(node.parentNode); }
    else                        { return "en"; }
};

transliterate.lang = {};

/* Define shortcuts to reduce code later */
(function() {
    var sp = String.prototype;
    sp.s  = sp.replace;         // 's' stands for substitute. It's like the Perl s///
    sp.lc = sp.toLowerCase;     // 'lc' is for lowercase

    /*jslint evil:true */
    var x = function(base, s) { return eval("a={\""+s.s(/,/g,"\",\"").s(/&/g, base).s(/:/g,"\":\""+base)+"\"}"); };

    transliterate.lang.sa = function () {
        var tm = {
            s: x("\\u09", "a:05,A:06,aa:06,i:07,I:08,ii:08,ee:08,u:09,U:0A,oo:0A,uu:0A,R:0B,Ru:0B,Ri:0B,Ruu:60,LR:0C,LRu:0C,LRi:0C,LRuu:61,e:0F,ea:0F,ae:0F,E:0F,ai:10,o:13,oa:13,oi:13&08,oe:13,ao:13,O:13,au:14,ou:14"),
            v: x("\\u09", "a:0C,A:3E,aa:3E,i:3F,I:40,ii:40,ee:40,u:41,U:42,oo:42,uu:42,R:43,Ru:43,Ri:43,Ruu:44,LR:62,LRu:62,LRi:62,LRuu:63,e:47,ea:47,ae:47,E:47,ai:48,o:4B,oa:4B,oi:4B&08,oe:4B,ao:4B,O:4B,au:4C,ou:4C,M:02,aM:02,iM:02,uM:02,oM:50"),
            c: x("\\u09", "k:15,K:16,Kh:16,KH:16,kh:16,g:17,gh:18,1n:19,c:1A,ch:1A,Ch:1B,CH:1B,j:1C,J:1D,2n:1E,t:1F,T:20,d:21,D:22,N:23,th:24,Th:25,TH:25,dh:26,Dh:27,DH:27,4n:28,n:28,p:2A,ph:2B,b:2C,B:2D,Bh:2D,BH:2D,bh:2D,m:2E,y:2F,r:30,l:32,L:33,v:35,w:35,sh:36,S:37,Sh:37,SH:37,s:38,h:39")
        };
        tm.v.a = "\u200C";
        function trans(s) {
            s = " " + s + " ";
            s=s.s(/[mn](?=[kgKG])/g,  "1n")
               .s(/[mn](?=[cjCJ])/g,  "2n")
               .s(/[mn](?=[tdTD]h)/g, "4n")
               .s(/n(?=[tdTD])/g,     "N")
               .s(/\b[gj]ny?/gi,      "2n")   // Ideally, should be gnya...
               .s(/\bn[yj]/gi,        "2n")
               .s(/\bn/gi,            "4n")
               .s(/[td][td]h/gi,      "thth")
               .s(/[cj][cj]h/gi,      "chch")
               .s(/([aeiou])h[aeiou]+\b/gi, "$1\u0903")
               // Treat m, n, r separately, because they should not be clubbed with h afterwards
               .s(/(\d?[mNnr])(?=[AEIOUaeiouRM])/g,                             function ($0, $1, $2) { return      (tm.c[$1] || tm.c[$1.lc()] || $1)           ;} )
               .s(/(\d?[mNnr])/g,                                               function ($0, $1, $2) { return      (tm.c[$1] || tm.c[$1.lc()] || $1) + "\u094D";} )
               .s(/(\d?[BCDGHJKLPSTVWYZbcdghjklpstvwyz]h?)(?=[AEIOUaeiouRM])/g, function ($0, $1, $2) { return      (tm.c[$1] || tm.c[$1.lc()] || $1)           ;} )
               .s(/(\d?[BCDGHJKLPSTVWYZbcdghjklpstvwyz]h?)/g,                   function ($0, $1, $2) { return      (tm.c[$1] || tm.c[$1.lc()] || $1) + "\u094D";} )
               .s(/([^A-Za-z\u0900-\u097F\u200C])([AEIOUaeiouRM]+)/g,           function ($0, $1, $2) { return $1 + (tm.s[$2] || tm.s[$2.lc()] || $2)           ;} )
               .s(/([AEIOUaeiouRM]+)/gi,                                        function ($0, $1, $2) { return      (tm.v[$1] || tm.v[$1.lc()] || $1)           ;} )
               .s(/\u200C/gi, "")
               .s(/\|\|/g, "\u0965")
               .s(/\|/g, "\u0964")
               .s(/^ /, "")
            ;
            return s;
        }
        return trans;
    }();

    transliterate.lang.ta = function() {
        var tm = {
            svow: x("\\u0B", "a:85,A:86,aa:86,i:87,I:88,ee:88,u:89,U:8A,oo:8A,uu:8A,e:8E,ea:8F,ae:8F,E:8F,ai:90,o:92,oa:93,O:93,au:94"),
            vowl: x("\\u0B", "a:BD,A:BE,aa:BE,i:BF,iu:BF&AF&C1,I:C0,ii:C0,ee:C0,u:C1,U:C2,oo:C2,uu:C2,e:C6,ei:C6&AF&CD,ea:C7,ae:C7,aei:C7&AF&CD,E:C7,ai:C8,aai:BE&AF&CD,o:CA,oa:CB,oe:CB,ao:CB,oi:CA&AF&CD,O:CB,au:CC,ou:CC"),
            cons: x("\\u0B", "k:95,kh:95,g:95,gh:95,ch:9A,s:9A,j:9C,t:9F,d:9F,N:A3,th:A4,dh:A4,n:A9,p:AA,ph:AA,b:AA,bh:AA,m:AE,y:AF,r:B0,R:B1,l:B2,L:B3,z:B4,zh:B4,v:B5,w:B5,sh:B7,S:B8,h:B9,1n:99,2n:9E,4n:A8")
        };

        return function (s) {
            s=" " + s;
            return s.s(/[Mmn](?=[kgKG])/g, "1n").
                s(/[Mmn](?=[cjCJ])/g,      "2n").
                s(/[Mmn](?=[tdTD][hH])/g,  "4n").
                s(/n(?=[tdTD])/g,   "N").
                s(/\bn[yj]/gi,      "2n").
                s(/\bn/gi,          "4n").
                s(/n[td]?r/gi,      "nR").
                s(/[td]r/gi,        "RR").
                s(/[td][td]h/gi,    "thth").
                s(/[cj][cj]h/gi,    "chch").
                s(/(\d?[bcdghjklmnprstvwyz]h?)(?=[aeiou])/gi, function ($0, $1, $2) { return      (tm.cons[$1] || tm.cons[$1.lc()] || $1); } ).
                s(/(\d?[bcdghjklmnprstvwyz]h?)/gi,            function ($0, $1, $2) { return      (tm.cons[$1] || tm.cons[$1.lc()] || $1)+ "\u0BCD"; } ).
                s(/([^A-Za-z\u0B80-\u0BFF])([aeiou]+)/gi,     function ($0, $1, $2) { return $1 + (tm.svow[$2] || tm.svow[$2.lc()] || $2); } ).
                s(/([aeiou]+)/gi,                             function ($0, $1, $2) { return      (tm.vowl[$1] || tm.vowl[$1.lc()] || $1); } ).
                s(/\u0BBD/gi, "").
                s(/\|/g, "<br/>");
        };
    }();
})();
