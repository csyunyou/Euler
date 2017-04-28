'use strict';
import $ from 'jquery';
let {Solid,Face,Loop,Edge,HalfEdge,Vertex} = require('./HalfedgeDS.js');
let sweeplist=[];
let nsolid=0,nface=0,nloop=0,nvertex=0;
let solids=null;
let res='';
function findVertex(id){
	for(let s=solids;s!==null;s=s.next){
		for(let v=s.vertex;v!==null;v=v.next){
			if(v.id===id)
				return v;
		}
	}
}
function addSolid(solid){
	solid.id=nsolid;
	nsolid+=1;
	let tmpsolid=solids;
	if(tmpsolid===null)
		solids=solid;
	else{
		while(tmpsolid.next!==null)
			tmpsolid=tmpsolid.next;
		tmpsolid.next=solid;
	}
}
function addFaceIntoSolid(face,solid){
	nface+=1;
	let tmpface=solid.face;
	if(tmpface===null)
		solid.face=face;
	else{
		while(tmpface.next!==null)
			tmpface=tmpface.next;
		tmpface.next=face;
	}
}
function addLoopIntoFace(loop,face,iskfmrh=false){
	if(!iskfmrh)
		nloop+=1;
	let tmploop=face.loop;
	if(tmploop===null)
		face.loop=loop;
	else{
		while(tmploop.next!==null)
			tmploop=tmploop.next;
		tmploop.next=loop;
	}
}
function addVertexIntoSolid(vertex,solid){
	vertex.id=nvertex;
	nvertex+=1;
	let tmpvertex=solid.vertex;
	if(tmpvertex===null)
		solid.vertex=vertex;
	else{
		while(tmpvertex.next!==null)
			tmpvertex=tmpvertex.next;
		tmpvertex.next=vertex;
	}
}
function addEdgeIntoSolid(edge,solid){
	let tmpedge=solid.edge;
	if(tmpedge===null)
		solid.edge=edge;
	else{
		while(tmpedge.next!==null)
			tmpedge=tmpedge.next;
		tmpedge.next=edge;
		edge.pre=tmpedge;

	}
}
function mvfs(x,y,z){
	let solid=new Solid();addSolid(solid);
	let face=new Face();addFaceIntoSolid(face,solid);
	let loop=new Loop();addLoopIntoFace(loop,face);
	let vertex=new Vertex(x,y,z);addVertexIntoSolid(vertex,solid);
	face.solid=solid;
	loop.face=face;
	return {solid,vertex,loop};
}
function mev(s_vertex,x,y,z,loop){
	let solid=loop.face.solid;
	let edge=new Edge();
	let l_half=new HalfEdge();
	let r_half=new HalfEdge();
	let e_vertex=new Vertex(x,y,z);addVertexIntoSolid(e_vertex,solid);
	l_half.start_v=s_vertex;
	l_half.end_v=e_vertex;
	r_half.start_v=e_vertex;
	r_half.end_v=s_vertex;
	edge.left_half=l_half;
	edge.right_half=r_half;
	l_half.edge=edge;
	r_half.edge=edge;
	l_half.partner=r_half;
	r_half.partner=l_half;
	l_half.loop=loop;
	r_half.loop=loop;
	if(loop.halfedges===null){
		l_half.next=r_half;
		r_half.next=l_half;
		l_half.pre=r_half;
		r_half.pre=l_half;
		loop.halfedges=l_half;
	}
	else{
		let tmphalf=loop.halfedges;
		while(tmphalf.end_v!==s_vertex){
			tmphalf=tmphalf.next;
		}
		r_half.next=tmphalf.next;
		tmphalf.next.pre=r_half;
		tmphalf.next=l_half;
		l_half.pre=tmphalf;
		l_half.next=r_half;
		r_half.pre=l_half;
	}
	return l_half;
}
function mef(sv,ev,loop,mark=false){
	let solid=loop.face.solid;
	let edge=new Edge();
	let l_half=new HalfEdge();
	let r_half=new HalfEdge();
	let face=new Face();addFaceIntoSolid(face,solid);
	let newloop=new Loop();addLoopIntoFace(newloop,face);
	l_half.start_v=sv;
	l_half.end_v=ev;
	r_half.start_v=ev;
	r_half.end_v=sv;
	l_half.partner=r_half;
	r_half.partner=l_half;
	l_half.edge=edge;
	r_half.edge=edge;
	edge.left_half=l_half;
	edge.right_half=r_half;
	let tmphalf=loop.halfedges,tmpa,tmpb,tmpc;
	while(tmphalf.end_v!==sv)
		tmphalf=tmphalf.next;
	tmpa=tmphalf;
	while(tmphalf.end_v!==ev)
		tmphalf=tmphalf.next;
	tmpb=tmphalf;
	while(tmphalf.end_v!==ev)
		tmphalf=tmphalf.next;
	tmpc=tmphalf;
	r_half.next=tmpa.next;
	tmpa.next.pre=r_half;
	tmpa.next=l_half;
	l_half.pre=tmpa;
	l_half.next=tmpb.next;
	tmpb.next.pre=l_half;
	tmpb.next=r_half;
	r_half.pre=tmpb;
	loop.halfedges=l_half;l_half.loop=loop;
	newloop.halfedges=r_half;r_half.loop=newloop;
	face.out_lp=newloop;newloop.face=face;//!!!
	face.solid=solid;
	if(mark)
		sweeplist.push(face);
	return loop;

}
function kemr(sv,ev,loop){
	let left_half=loop.halfedges;
	let right_half=loop.halfedges;
	let face=loop.face;
	let inner_lp=new Loop();addLoopIntoFace(inner_lp,face);
	while((left_half.start_v!==sv)||(left_half.end_v!==ev))
		left_half=left_half.next;
	while((right_half.start_v!==ev)||(right_half.end_v!==sv))
		right_half=right_half.next;
	right_half.pre.next=left_half.next;
	left_half.pre.next=right_half.next;
	left_half.next.pre=right_half.pre;
	right_half.next.pre=left_half.pre;
	inner_lp.halfedges=right_half.pre;
	loop.halfedges=left_half.pre;
	inner_lp.face=face;
}
function kfmrh(outlp,innerlp){
	let fa=outlp.face;
	let fb=innerlp.face;
	addLoopIntoFace(innerlp,fa,true);
	let tmpface=fa.solid.face;
	if(tmpface===fb)
		fa.solid.face=tmpface.next;
	else{
		while(tmpface.next!==fb)
			tmpface=tmpface.next;
		tmpface.next=fb.next;
	}
	nface--;
	return innerlp;
}
function sweep({xdir,ydir,zdir},d){
	sweeplist.forEach(function(face){
		let firstV,preV,nextV,firstNewV,preNewV,nextNewV;
		let loop=face.loop;
		let he=loop.halfedges;
		firstV=preV=he.start_v;
		let newx=firstV.x+d*xdir;
		let newy=firstV.y+d*ydir;
		let newz=firstV.z+d*zdir;
		let l_half=mev(firstV,newx,newy,newz,loop);
		firstNewV=l_half.end_v;
		preNewV=firstNewV;
		nextV=he.end_v;
		do{
			he=he.next;
			preV=he.start_v;
			newx=nextV.x+d*xdir;
			newy=nextV.y+d*ydir;
			newz=nextV.z+d*zdir;
			l_half=mev(nextV,newx,newy,newz,loop);
			nextV=he.end_v;
			nextNewV=l_half.end_v;
			mef(preNewV,nextNewV,loop);
			preNewV=nextNewV;
		}while(nextV!==firstV);
		mef(preNewV,firstNewV,loop);
	});
}
function print(){
	res=res+'BRP\n';
	// console.log(nvertex+" "+nloop+" "+nface+" "+nsolid);
	res=res+nvertex+' '+nloop+' '+nface+' '+nsolid+'\n';
	console.log('Vertex:');
	for(let s=solids;s!==null;s=s.next){
		for(let v=s.vertex;v!==null;v=v.next){
			console.log(v.x+","+v.y+","+v.z);
			res=res+v.x+' '+v.y+' '+v.z+'\n';
		}
	}
	console.log('Loop:');
	let lcnt=0;
	for(let s=solids;s!==null;s=s.next){
		for(let f=s.face;f!==null;f=f.next){
			for(let l=f.loop;l!==null;l=l.next){
				l.id=lcnt;
				lcnt+=1;
				let tmpvertex=[];
				let start=l.halfedges.start_v;
				tmpvertex.push(start.id);
				for(let he=l.halfedges.next;he.start_v!==start;he=he.next){
					tmpvertex.push(he.start_v.id);
				}
				console.log(tmpvertex.length+","+tmpvertex.toString());
				res=res+tmpvertex.length+' '+tmpvertex.join(' ')+'\n';	
			}
		}
	}
	console.log('Face');
	for(let s=solids;s!==null;s=s.next){
		for(let f=s.face;f!==null;f=f.next){
			let tmpinnerloop=[];
			for(let l=f.loop.next;l!==null;l=l.next){
				tmpinnerloop.push(l.id);
			}
			console.log(f.loop.id+","+tmpinnerloop.length+","+tmpinnerloop.toString()+","+f.solid.id);
			res=res+f.loop.id+' '+tmpinnerloop.length;
			if(tmpinnerloop.length===0)
				res=res+' '+f.solid.id+'\n';
			else
				res=res+' '+tmpinnerloop.join(' ')+' '+f.solid.id+'\n';
		}
	}
	$.ajax({
		url:'http://localhost:3000/files/writeFile',
		type:'POST',
		data:{data:res}
	}).done(function(){
		console.log('success');
	});
}
//
let {solid:s,vertex:v,loop:l}=mvfs(0,0,5);//l is the bottom loop
mev(v,0,9,5,l);v=v.next;
mev(v,8,9,5,l);v=v.next;
mev(v,8,0,5,l);v=v.next;
mef(v,findVertex(0),l);
v=findVertex(0);
mev(v,0,0,0,l);v=v.next;
mev(v,0,9,0,l);v=v.next;
mev(v,8,9,0,l);v=v.next;
mev(v,8,0,0,l);v=v.next;
mef(findVertex(4),findVertex(5),l);
mef(findVertex(5),findVertex(6),l);
mef(findVertex(6),findVertex(7),l);
mef(findVertex(7),findVertex(4),l);
//generate letter 'J'
l=solids.face.next.loop;//top loop
mev(findVertex(0),1,1,5,l);
mev(findVertex(8),1,4,5,l);
mev(findVertex(9),2,4,5,l);
mev(findVertex(10),2,3,5,l);
mev(findVertex(11),6,3,5,l);
mev(findVertex(12),6,1,5,l); 
//mev(findVertex(12),6,2,5,l);
mev(findVertex(13),5,1,5,l);
mev(findVertex(14),5,2,5,l);
mev(findVertex(15),2,2,5,l);
mev(findVertex(16),2,1,5,l);
mef(findVertex(17),findVertex(8),l,true);
kemr(findVertex(0),findVertex(8),l);
sweep({xdir:0,ydir:0,zdir:-1},5);
l=solids.face.loop;//l is the bottom loop
kfmrh(l,sweeplist[0].loop);
sweeplist.pop();
//generate letter 'S'
/*l=solids.face.next.loop;//top loop
mev(findVertex(0),1,5,5,l);
mev(findVertex(28),1,8,5,l);
mev(findVertex(29),2,8,5,l);
mev(findVertex(30),2,6,5,l);
mev(findVertex(31),3,6,5,l);
mev(findVertex(32),3,8,5,l);
mev(findVertex(33),6,8,5,l);
mev(findVertex(34),6,5,5,l);
mev(findVertex(35),5,5,5,l);
mev(findVertex(36),5,7,5,l);
mev(findVertex(37),4,7,5,l);
mev(findVertex(38),4,5,5,l);
mef(findVertex(39),findVertex(28),l,true);
kemr(findVertex(0),findVertex(28),l);
sweep({xdir:0,ydir:0,zdir:-1},5);
l=solids.face.loop;//l is the bottom loop
kfmrh(l,sweeplist[0].loop);
sweeplist.pop();*/
//write to file 'output.brp'
print();
/*v=findVertex(0);
l=solids.face.next.loop;//top loop
mev(findVertex(0),1,1,5,l);
mev(findVertex(8),1,4,5,l);
mev(findVertex(9),2,4,5,l);
mev(findVertex(10),2,1,5,l);
mef(findVertex(11),findVertex(8),l,true);
kemr(findVertex(0),findVertex(8),l);
sweep({xdir:0,ydir:0,zdir:-1},5);
l=solids.face.loop;//l is the bottom loop
kfmrh(l,sweeplist[0].loop);
sweeplist.pop();
l=solids.face.next.loop;//top loop
mev(findVertex(0),3,1,5,l);
mev(findVertex(16),3,4,5,l);
mev(findVertex(17),4,4,5,l);
mev(findVertex(18),4,1,5,l);
mef(findVertex(19),findVertex(16),l,true);
kemr(findVertex(0),findVertex(16),l);
sweep({xdir:0,ydir:0,zdir:-1},5);
l=solids.face.loop;//l is the bottom loop
kfmrh(l,sweeplist[0].loop);*/



/*fs.writeFile('./output.txt', data, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('ok.');
    }
});*/