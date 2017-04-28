'use strict';
console.log('aa'&&'bb');
console.log(undefined&&'aa');
console.log(746+466+37);
function a(){
	var c=3;
	function test(){
		console.log(c);
	}
	test();
}
a();
let arr=[1,5,3];
console.log(Math.max.apply(null,arr));
let obj={a:2,b:'hey'};
console.log(obj.a);
function mySort(arr){
	return arr.sort((x,y)=>x-y);
}
// mySort(arr);
console.log(arr);
let brr=arr;
arr.push(30);
brr.push(31);
console.log(arr);
console.log(brr);
brr.forEach(function(d,i){
	console.log(i);
});
let objarr=[{num:2},{num:3},{num:4}];
let {num:sum}=objarr.reduce((x,y)=>{console.log(x);console.log(y);return {num:x.num+y.num};});
console.log('sum:'+sum);
let {num:sum3}=objarr.reduce(({num:x},{num:y})=>{return {num:x+y};});
console.log(sum3);
let arr2=[2,3,4];
let sum2=arr2.reduce((x,y)=>{console.log('hey:'+x+','+y);return x+y;});
console.log(sum2);