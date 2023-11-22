import{_ as s,o as n,c as a,R as l}from"./chunks/framework._4g7boG9.js";const F=JSON.parse('{"title":"1. 数组中两个数的和为给定值","description":"","frontmatter":{},"headers":[],"relativePath":"wiki/Leetcode题解-哈希表.md","filePath":"wiki/Leetcode题解-哈希表.md","lastUpdated":1700574435000}'),p={name:"wiki/Leetcode题解-哈希表.md"},o=l(`<ul><li><a href="#1-数组中两个数的和为给定值">1. 数组中两个数的和为给定值</a></li><li><a href="#2-判断数组是否含有重复元素">2. 判断数组是否含有重复元素</a></li><li><a href="#3-最长和谐序列">3. 最长和谐序列</a></li><li><a href="#4-最长连续序列">4. 最长连续序列</a></li></ul><p>哈希表使用 O(N) 空间复杂度存储数据，并且以 O(1) 时间复杂度求解问题。</p><ul><li><p>Java 中的 <strong>HashSet</strong> 用于存储一个集合，可以查找元素是否在集合中。如果元素有穷，并且范围不大，那么可以用一个布尔数组来存储一个元素是否存在。例如对于只有小写字符的元素，就可以用一个长度为 26 的布尔数组来存储一个字符集合，使得空间复杂度降低为 O(1)。</p></li><li><p>Java 中的 <strong>HashMap</strong> 主要用于映射关系，从而把两个元素联系起来。HashMap 也可以用来对元素进行计数统计，此时键为元素，值为计数。和 HashSet 类似，如果元素有穷并且范围不大，可以用整型数组来进行统计。在对一个内容进行压缩或者其它转换时，利用 HashMap 可以把原始内容和转换后的内容联系起来。例如在一个简化 url 的系统中 <a href="https://leetcode.com/problems/encode-and-decode-tinyurl/description/" target="_blank" rel="noreferrer">Leetcdoe : 535. Encode and Decode TinyURL (Medium)</a>，利用 HashMap 就可以存储精简后的 url 到原始 url 的映射，使得不仅可以显示简化的 url，也可以根据简化的 url 得到原始 url 从而定位到正确的资源。</p></li></ul><h1 id="_1-数组中两个数的和为给定值" tabindex="-1">1. 数组中两个数的和为给定值 <a class="header-anchor" href="#_1-数组中两个数的和为给定值" aria-label="Permalink to &quot;1. 数组中两个数的和为给定值&quot;">​</a></h1><p><a href="https://leetcode.com/problems/two-sum/description/" target="_blank" rel="noreferrer">1. Two Sum (Easy)</a></p><p>可以先对数组进行排序，然后使用双指针方法或者二分查找方法。这样做的时间复杂度为 O(NlogN)，空间复杂度为 O(1)。</p><p>用 HashMap 存储数组元素和索引的映射，在访问到 nums[i] 时，判断 HashMap 中是否存在 target - nums[i]，如果存在说明 target - nums[i] 所在的索引和 i 就是要找的两个数。该方法的时间复杂度为 O(N)，空间复杂度为 O(N)，使用空间来换取时间。</p><div class="language-java vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;">[] </span><span style="color:#B392F0;">twoSum</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;">[] nums, </span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> target) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    HashMap&lt;</span><span style="color:#F97583;">Integer</span><span style="color:#E1E4E8;">, </span><span style="color:#F97583;">Integer</span><span style="color:#E1E4E8;">&gt; indexForNum </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> HashMap&lt;&gt;();</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> (</span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> i </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;">; i </span><span style="color:#F97583;">&lt;</span><span style="color:#E1E4E8;"> nums.length; i</span><span style="color:#F97583;">++</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (indexForNum.</span><span style="color:#B392F0;">containsKey</span><span style="color:#E1E4E8;">(target </span><span style="color:#F97583;">-</span><span style="color:#E1E4E8;"> nums[i])) {</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;">[]{indexForNum.</span><span style="color:#B392F0;">get</span><span style="color:#E1E4E8;">(target </span><span style="color:#F97583;">-</span><span style="color:#E1E4E8;"> nums[i]), i};</span></span>
<span class="line"><span style="color:#E1E4E8;">        } </span><span style="color:#F97583;">else</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">            indexForNum.</span><span style="color:#B392F0;">put</span><span style="color:#E1E4E8;">(nums[i], i);</span></span>
<span class="line"><span style="color:#E1E4E8;">        }</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">null</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;">[] </span><span style="color:#6F42C1;">twoSum</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;">[] nums, </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> target) {</span></span>
<span class="line"><span style="color:#24292E;">    HashMap&lt;</span><span style="color:#D73A49;">Integer</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">Integer</span><span style="color:#24292E;">&gt; indexForNum </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> HashMap&lt;&gt;();</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> i </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">; i </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;"> nums.length; i</span><span style="color:#D73A49;">++</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (indexForNum.</span><span style="color:#6F42C1;">containsKey</span><span style="color:#24292E;">(target </span><span style="color:#D73A49;">-</span><span style="color:#24292E;"> nums[i])) {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;">[]{indexForNum.</span><span style="color:#6F42C1;">get</span><span style="color:#24292E;">(target </span><span style="color:#D73A49;">-</span><span style="color:#24292E;"> nums[i]), i};</span></span>
<span class="line"><span style="color:#24292E;">        } </span><span style="color:#D73A49;">else</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">            indexForNum.</span><span style="color:#6F42C1;">put</span><span style="color:#24292E;">(nums[i], i);</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">null</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><h1 id="_2-判断数组是否含有重复元素" tabindex="-1">2. 判断数组是否含有重复元素 <a class="header-anchor" href="#_2-判断数组是否含有重复元素" aria-label="Permalink to &quot;2. 判断数组是否含有重复元素&quot;">​</a></h1><p><a href="https://leetcode.com/problems/contains-duplicate/description/" target="_blank" rel="noreferrer">217. Contains Duplicate (Easy)</a></p><div class="language-java vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">boolean</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">containsDuplicate</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;">[] nums) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    Set&lt;</span><span style="color:#F97583;">Integer</span><span style="color:#E1E4E8;">&gt; set </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> HashSet&lt;&gt;();</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> (</span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> num </span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> nums) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        set.</span><span style="color:#B392F0;">add</span><span style="color:#E1E4E8;">(num);</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> set.</span><span style="color:#B392F0;">size</span><span style="color:#E1E4E8;">() </span><span style="color:#F97583;">&lt;</span><span style="color:#E1E4E8;"> nums.length;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">boolean</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">containsDuplicate</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;">[] nums) {</span></span>
<span class="line"><span style="color:#24292E;">    Set&lt;</span><span style="color:#D73A49;">Integer</span><span style="color:#24292E;">&gt; set </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> HashSet&lt;&gt;();</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> num </span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> nums) {</span></span>
<span class="line"><span style="color:#24292E;">        set.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(num);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> set.</span><span style="color:#6F42C1;">size</span><span style="color:#24292E;">() </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;"> nums.length;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><h1 id="_3-最长和谐序列" tabindex="-1">3. 最长和谐序列 <a class="header-anchor" href="#_3-最长和谐序列" aria-label="Permalink to &quot;3. 最长和谐序列&quot;">​</a></h1><p><a href="https://leetcode.com/problems/longest-harmonious-subsequence/description/" target="_blank" rel="noreferrer">594. Longest Harmonious Subsequence (Easy)</a></p><div class="language-html vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">Input: [1,3,2,2,5,2,3,7]</span></span>
<span class="line"><span style="color:#E1E4E8;">Output: 5</span></span>
<span class="line"><span style="color:#E1E4E8;">Explanation: The longest harmonious subsequence is [3,2,2,2,3].</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">Input: [1,3,2,2,5,2,3,7]</span></span>
<span class="line"><span style="color:#24292E;">Output: 5</span></span>
<span class="line"><span style="color:#24292E;">Explanation: The longest harmonious subsequence is [3,2,2,2,3].</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>和谐序列中最大数和最小数之差正好为 1，应该注意的是序列的元素不一定是数组的连续元素。</p><div class="language-java vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">findLHS</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;">[] nums) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    Map&lt;</span><span style="color:#F97583;">Integer</span><span style="color:#E1E4E8;">, </span><span style="color:#F97583;">Integer</span><span style="color:#E1E4E8;">&gt; countForNum </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> HashMap&lt;&gt;();</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> (</span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> num </span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> nums) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        countForNum.</span><span style="color:#B392F0;">put</span><span style="color:#E1E4E8;">(num, countForNum.</span><span style="color:#B392F0;">getOrDefault</span><span style="color:#E1E4E8;">(num, </span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">+</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> longest </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> (</span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> num </span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> countForNum.</span><span style="color:#B392F0;">keySet</span><span style="color:#E1E4E8;">()) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (countForNum.</span><span style="color:#B392F0;">containsKey</span><span style="color:#E1E4E8;">(num </span><span style="color:#F97583;">+</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">)) {</span></span>
<span class="line"><span style="color:#E1E4E8;">            longest </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> Math.</span><span style="color:#B392F0;">max</span><span style="color:#E1E4E8;">(longest, countForNum.</span><span style="color:#B392F0;">get</span><span style="color:#E1E4E8;">(num </span><span style="color:#F97583;">+</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">+</span><span style="color:#E1E4E8;"> countForNum.</span><span style="color:#B392F0;">get</span><span style="color:#E1E4E8;">(num));</span></span>
<span class="line"><span style="color:#E1E4E8;">        }</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> longest;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">findLHS</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;">[] nums) {</span></span>
<span class="line"><span style="color:#24292E;">    Map&lt;</span><span style="color:#D73A49;">Integer</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">Integer</span><span style="color:#24292E;">&gt; countForNum </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> HashMap&lt;&gt;();</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> num </span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> nums) {</span></span>
<span class="line"><span style="color:#24292E;">        countForNum.</span><span style="color:#6F42C1;">put</span><span style="color:#24292E;">(num, countForNum.</span><span style="color:#6F42C1;">getOrDefault</span><span style="color:#24292E;">(num, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> longest </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> num </span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> countForNum.</span><span style="color:#6F42C1;">keySet</span><span style="color:#24292E;">()) {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (countForNum.</span><span style="color:#6F42C1;">containsKey</span><span style="color:#24292E;">(num </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">)) {</span></span>
<span class="line"><span style="color:#24292E;">            longest </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> Math.</span><span style="color:#6F42C1;">max</span><span style="color:#24292E;">(longest, countForNum.</span><span style="color:#6F42C1;">get</span><span style="color:#24292E;">(num </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> countForNum.</span><span style="color:#6F42C1;">get</span><span style="color:#24292E;">(num));</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> longest;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><h1 id="_4-最长连续序列" tabindex="-1">4. 最长连续序列 <a class="header-anchor" href="#_4-最长连续序列" aria-label="Permalink to &quot;4. 最长连续序列&quot;">​</a></h1><p><a href="https://leetcode.com/problems/longest-consecutive-sequence/description/" target="_blank" rel="noreferrer">128. Longest Consecutive Sequence (Hard)</a></p><div class="language-html vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">Given [100, 4, 200, 1, 3, 2],</span></span>
<span class="line"><span style="color:#E1E4E8;">The longest consecutive elements sequence is [1, 2, 3, 4]. Return its length: 4.</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">Given [100, 4, 200, 1, 3, 2],</span></span>
<span class="line"><span style="color:#24292E;">The longest consecutive elements sequence is [1, 2, 3, 4]. Return its length: 4.</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>要求以 O(N) 的时间复杂度求解。</p><div class="language-java vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">longestConsecutive</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;">[] nums) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    Map&lt;</span><span style="color:#F97583;">Integer</span><span style="color:#E1E4E8;">, </span><span style="color:#F97583;">Integer</span><span style="color:#E1E4E8;">&gt; countForNum </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> HashMap&lt;&gt;();</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> (</span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> num </span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> nums) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        countForNum.</span><span style="color:#B392F0;">put</span><span style="color:#E1E4E8;">(num, </span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> (</span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> num </span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> nums) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">forward</span><span style="color:#E1E4E8;">(countForNum, num);</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">maxCount</span><span style="color:#E1E4E8;">(countForNum);</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">private</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">forward</span><span style="color:#E1E4E8;">(Map</span><span style="color:#F97583;">&lt;</span><span style="color:#E1E4E8;">Integer, Integer</span><span style="color:#F97583;">&gt;</span><span style="color:#E1E4E8;"> countForNum, </span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> num) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (</span><span style="color:#F97583;">!</span><span style="color:#E1E4E8;">countForNum.</span><span style="color:#B392F0;">containsKey</span><span style="color:#E1E4E8;">(num)) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> cnt </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> countForNum.</span><span style="color:#B392F0;">get</span><span style="color:#E1E4E8;">(num);</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (cnt </span><span style="color:#F97583;">&gt;</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> cnt;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">    cnt </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">forward</span><span style="color:#E1E4E8;">(countForNum, num </span><span style="color:#F97583;">+</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">+</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    countForNum.</span><span style="color:#B392F0;">put</span><span style="color:#E1E4E8;">(num, cnt);</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> cnt;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">private</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">maxCount</span><span style="color:#E1E4E8;">(Map</span><span style="color:#F97583;">&lt;</span><span style="color:#E1E4E8;">Integer, Integer</span><span style="color:#F97583;">&gt;</span><span style="color:#E1E4E8;"> countForNum) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> max </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> (</span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> num </span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> countForNum.</span><span style="color:#B392F0;">keySet</span><span style="color:#E1E4E8;">()) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        max </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> Math.</span><span style="color:#B392F0;">max</span><span style="color:#E1E4E8;">(max, countForNum.</span><span style="color:#B392F0;">get</span><span style="color:#E1E4E8;">(num));</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> max;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">longestConsecutive</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;">[] nums) {</span></span>
<span class="line"><span style="color:#24292E;">    Map&lt;</span><span style="color:#D73A49;">Integer</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">Integer</span><span style="color:#24292E;">&gt; countForNum </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> HashMap&lt;&gt;();</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> num </span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> nums) {</span></span>
<span class="line"><span style="color:#24292E;">        countForNum.</span><span style="color:#6F42C1;">put</span><span style="color:#24292E;">(num, </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> num </span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> nums) {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">forward</span><span style="color:#24292E;">(countForNum, num);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">maxCount</span><span style="color:#24292E;">(countForNum);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">private</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">forward</span><span style="color:#24292E;">(Map</span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;">Integer, Integer</span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;"> countForNum, </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> num) {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">!</span><span style="color:#24292E;">countForNum.</span><span style="color:#6F42C1;">containsKey</span><span style="color:#24292E;">(num)) {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> cnt </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> countForNum.</span><span style="color:#6F42C1;">get</span><span style="color:#24292E;">(num);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (cnt </span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> cnt;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    cnt </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">forward</span><span style="color:#24292E;">(countForNum, num </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    countForNum.</span><span style="color:#6F42C1;">put</span><span style="color:#24292E;">(num, cnt);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> cnt;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">private</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">maxCount</span><span style="color:#24292E;">(Map</span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;">Integer, Integer</span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;"> countForNum) {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> max </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> num </span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> countForNum.</span><span style="color:#6F42C1;">keySet</span><span style="color:#24292E;">()) {</span></span>
<span class="line"><span style="color:#24292E;">        max </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> Math.</span><span style="color:#6F42C1;">max</span><span style="color:#24292E;">(max, countForNum.</span><span style="color:#6F42C1;">get</span><span style="color:#24292E;">(num));</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> max;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br></div></div>`,21),e=[o];function t(r,c,E,y,i,u){return n(),a("div",null,e)}const b=s(p,[["render",t]]);export{F as __pageData,b as default};
