'use strict';
function Solid(){
	this.id=0;
	this.face=null;
	this.edge=null;
	this.next=null;
	this.pre=null;
	this.vnum=0;
	this.enum=0;
	this.lnum=0;
	this.vertex=null;
}
function Face(){
	this.id=0;
	this.solid=null;
	//this.out_lp=null;
	//this.inner_lp=null;
	this.loop=null;
	this.next=null;
	this.pre=null;
	this.inncnt=0;
}
function Loop(){
	this.id=0;
	this.halfedges=null;
	this.face=null;
	this.next=null;
	this.pre=null;
}
function Edge(){
	this.left_half=null;
	this.right_half=null;
	this.next=null;
	this.pre=null;
}
function HalfEdge(){
	this.edge=null;
	this.start_v=null;
	this.end_v=null;
	this.loop=null;
	this.next=null;
	this.pre=null;
	this.partner=null;
}
function Vertex(x,y,z){
	this.id=0;
	this.x=x;
	this.y=y;
	this.z=z;
	this.next=null;
	this.pre=null;
}
export {Solid,Face,Loop,Edge,HalfEdge,Vertex};