////////////////////////////////////////////////////////////
// GAME v1.4
////////////////////////////////////////////////////////////

/*!
 * 
 * GAME SETTING CUSTOMIZATION START
 * 
 */

//instruction array list
var instruction_arr = ['assets/item_welcome_01.png', 'assets/item_welcome_02.png'];

//objects array list
var objects_arr = [
					{src:'assets/interior_entrance.png', id:'entrancedoor', width:189, height:236, regX:110, regY:192, count:0},
					{src:'assets/interior_stock.png', id:'storedoor', width:107, height:156, regX:83, regY:129, count:0},
					{src:'assets/interior_frozen_01.png', id:'frozen01', width:115, height:150, regX:47, regY:122, count:4},
					{src:'assets/interior_frozen_02.png', id:'frozen02', width:115, height:150, regX:47, regY:122, count:4},
					{src:'assets/interior_frozen_03.png', id:'frozen03', width:130, height:110, regX:38, regY:75, count:4},
					{src:'assets/interior_meat_01.png', id:'meat01', width:142, height:122, regX:85, regY:105, count:4},
					{src:'assets/interior_meat_02.png', id:'meat02', width:142, height:122, regX:85, regY:105, count:4},
					{src:'assets/interior_veg_01.png', id:'veg01', width:142, height:125, regX:70, regY:100, count:4},
					{src:'assets/interior_veg_02.png', id:'veg02', width:142, height:125, regX:70, regY:100, count:4},
					{src:'assets/interior_gro_01.png', id:'gro01', width:134, height:144, regX:72, regY:108, count:4},
					{src:'assets/interior_gro_02.png', id:'gro02', width:134, height:144, regX:64, regY:108, count:4},
					{src:'assets/interior_gro_03.png', id:'gro03', width:134, height:144, regX:64, regY:108, count:4},
					{src:'assets/interior_gro_04.png', id:'gro04', width:134, height:144, regX:64, regY:108, count:4},
					{src:'assets/interior_gro_05.png', id:'gro05', width:134, height:144, regX:64, regY:108, count:4},
					{src:'assets/interior_gro_06.png', id:'gro06', width:134, height:144, regX:64, regY:108, count:4},
					{src:'assets/interior_promo_01.png', id:'promo01', width:82, height:91, regX:41, regY:85, count:4},
					{src:'assets/interior_promo_02.png', id:'promo02', width:82, height:91, regX:41, regY:85, count:4},
					{src:'assets/interior_promo_03.png', id:'promo03', width:82, height:91, regX:41, regY:85, count:4},
					{src:'assets/interior_elec_01.png', id:'elec01', width:114, height:125, regX:45, regY:86, count:4},
					{src:'assets/interior_elec_02.png', id:'elec02', width:114, height:125, regX:45, regY:86, count:4},
					{src:'assets/interior_elec_03.png', id:'elec03', width:114, height:125, regX:45, regY:86, count:4},
					{src:'assets/interior_fashion_01.png', id:'fashion01', width:61, height:74, regX:14, regY:50, count:4},
					{src:'assets/interior_fashion_02.png', id:'fashion02', width:61, height:74, regX:14, regY:50, count:4},
					{src:'assets/interior_fashion_03.png', id:'fashion03', width:70, height:62, regX:20, regY:35, count:4},
					{src:'assets/interior_fashion_04.png', id:'fashion04', width:70, height:62, regX:20, regY:35, count:4},
					{src:'assets/interior_fence.png', id:'fence', width:68, height:62, regX:33, regY:49, count:0},
					{src:'assets/interior_cashier_01.png', id:'cashier01', width:130, height:132, regX:44, regY:95, count:0},
					{src:'assets/interior_cashier_lock_01.png', id:'cashierlock01', width:130, height:132, regX:44, regY:95, count:0},
					{src:'assets/interior_cashier_02.png', id:'cashier02', width:38, height:70, regX:20, regY:45, count:0},
					{src:'assets/interior_sensor.png', id:'sensor', width:20, height:58, regX:10, regY:50, count:0},
					{src:'assets/interior_stock_01.png', id:'restock01', width:93, height:90, regX:45, regY:80, count:4},
					{src:'assets/interior_stock_lock_01.png', id:'restocklock01', width:93, height:90, regX:45, regY:80, count:4},
					{src:'assets/interior_stock_02.png', id:'restock02', width:93, height:90, regX:45, regY:80, count:4},
					{src:'assets/interior_promo_lock.png', id:'promolock', width:82, height:91, regX:41, regY:85, count:0},
					{src:'assets/interior_gro_lock_01.png', id:'grolock1', width:134, height:144, regX:64, regY:108, count:0},
					{src:'assets/interior_gro_lock_02.png', id:'grolock2', width:134, height:144, regX:64, regY:108, count:0},
					{src:'assets/interior_elec_lock_01.png', id:'eleclock1', width:114, height:125, regX:45, regY:86, count:0},
					{src:'assets/interior_elec_lock_02.png', id:'eleclock2', width:114, height:125, regX:45, regY:86, count:0},
					{src:'assets/interior_elec_lock_01.png', id:'eleclock3', width:114, height:125, regX:45, regY:86, count:0},
					{src:'assets/interior_fashion_lock_01.png', id:'fashionlock1', width:61, height:74, regX:14, regY:50, count:0},
					{src:'assets/interior_fashion_lock_02.png', id:'fashionlock2', width:61, height:74, regX:14, regY:50, count:0},
					{src:'assets/interior_fashion_lock_03.png', id:'fashionlock3', width:70, height:62, regX:20, regY:35, count:0},
					{src:'assets/interior_fashion_lock_04.png', id:'fashionlock4', width:70, height:62, regX:20, regY:35, count:0},
				];

//objects place in position array list			
var position_arr = [
						{id:'entrancedoor', r:38, c:15, mask:[{r:37, c:12},{r:38, c:12},{r:38, c:13},{r:38, c:14},{r:38, c:15},{r:38, c:16},{r:38, c:17},{r:38, c:18}], block:[{r:35, c:11},{r:35, c:12},{r:35, c:13},{r:35, c:14},{r:34, c:15},{r:35, c:15},{r:36, c:14},{r:39, c:13},{r:36, c:13},{r:37, c:13},{r:38, c:13},{r:39, c:13},{r:40, c:13},{r:41, c:13}], area:[], type:''},
						{id:'storedoor', r:6, c:16, mask:[{r:6, c:13},{r:6, c:14},{r:6, c:15},{r:6, c:16},{r:6, c:17},{r:6, c:18}], block:[{r:0, c:10},{r:1, c:10},{r:2, c:10},{r:3, c:10},{r:4, c:10},{r:5, c:10},{r:6, c:10},{r:6, c:11},{r:6, c:12},{r:6, c:13},{r:6, c:14},{r:6, c:15},{r:6, c:18},{r:6, c:19},{r:6, c:20},{r:6, c:21},{r:5, c:15},{r:4, c:15},{r:3, c:15},{r:5, c:19},{r:4, c:20},{r:3, c:21},{r:2, c:21},{r:1, c:21},{r:0, c:21}], area:[], type:''},
						
						{id:'frozen01', r:7, c:7, mask:[{r:7, c:9},{r:7, c:8},{r:7, c:7},{r:7, c:6}], block:[{r:7, c:9},{r:7, c:8},{r:7, c:7},{r:7, c:6}], area:[{r:8, c:9},{r:8, c:8},{r:8, c:7},{r:8, c:6}], type:'item', item:8, cost:30, icon:{x:15, y:-50}},
						{id:'frozen02', r:7, c:12, mask:[{r:7, c:11},{r:7, c:12},{r:7, c:13},{r:7, c:14}], block:[{r:7, c:11},{r:7, c:12},{r:7, c:13},{r:7, c:14}], area:[{r:8, c:11},{r:8, c:12},{r:8, c:13},{r:8, c:14}], type:'item', item:8, cost:30, icon:{x:15, y:-50}},
						{id:'frozen03', r:11, c:4, mask:[{r:10, c:4},{r:10, c:5},{r:11, c:4},{r:11, c:5},{r:12, c:4},{r:12, c:5},{r:13, c:4},{r:13, c:5}], block:[{r:10, c:4},{r:10, c:5},{r:11, c:4},{r:11, c:5},{r:12, c:4},{r:12, c:5},{r:13, c:4},{r:13, c:5}], area:[{r:10, c:6},{r:11, c:6},{r:12, c:6},{r:13, c:6}], type:'item', item:8, cost:30, icon:{x:23, y:-48}},
						{id:'frozen03', r:16, c:4, mask:[{r:15, c:4},{r:15, c:5},{r:16, c:4},{r:16, c:5},{r:17, c:4},{r:17, c:5},{r:18, c:4},{r:18, c:5}], block:[{r:15, c:4},{r:15, c:5},{r:16, c:4},{r:16, c:5},{r:17, c:4},{r:17, c:5},{r:18, c:4},{r:18, c:5}], area:[{r:15, c:6},{r:16, c:6},{r:17, c:6},{r:18, c:6}], type:'item', item:8, cost:30, icon:{x:23, y:-48}},
	
						{id:'meat01', r:12, c:9, mask:[{r:10, c:8},{r:10, c:9},{r:10, c:10},{r:10, c:11},{r:11, c:8},{r:11, c:9},{r:11, c:10},{r:11, c:11},{r:12, c:8},{r:12, c:9},{r:12, c:10},{r:12, c:11}], block:[{r:10, c:8},{r:10, c:9},{r:10, c:10},{r:10, c:11},{r:11, c:8},{r:11, c:9},{r:11, c:10},{r:11, c:11},{r:12, c:8},{r:12, c:9},{r:12, c:10},{r:12, c:11}], area:[{r:13, c:8},{r:13, c:9},{r:13, c:10},{r:13, c:11}], type:'item', item:8, cost:50, icon:{x:-15, y:-70}},
						{id:'meat02', r:12, c:14, mask:[{r:10, c:13},{r:10, c:14},{r:10, c:15},{r:10, c:16},{r:11, c:13},{r:11, c:14},{r:11, c:15},{r:11, c:16},{r:12, c:13},{r:12, c:14},{r:12, c:15},{r:12, c:16}], block:[{r:10, c:13},{r:10, c:14},{r:10, c:15},{r:10, c:16},{r:11, c:13},{r:11, c:14},{r:11, c:15},{r:11, c:16},{r:12, c:13},{r:12, c:14},{r:12, c:15},{r:12, c:16}], area:[{r:13, c:13},{r:13, c:14},{r:13, c:15},{r:13, c:16}], type:'item', item:8, cost:50, icon:{x:-15, y:-70}},
	
						{id:'veg01', r:16, c:9, mask:[{r:15, c:8},{r:15, c:9},{r:15, c:10},{r:15, c:11},{r:16, c:8},{r:16, c:9},{r:16, c:10},{r:16, c:11}], block:[{r:15, c:8},{r:15, c:9},{r:15, c:10},{r:15, c:11},{r:16, c:8},{r:16, c:9},{r:16, c:10},{r:16, c:11}], area:[{r:17, c:8},{r:17, c:9},{r:17, c:10},{r:17, c:11}], type:'item', item:8, cost:25, icon:{x:0, y:-69}},
						{id:'veg02', r:20, c:9, mask:[{r:19, c:8},{r:19, c:9},{r:19, c:10},{r:19, c:11},{r:20, c:8},{r:20, c:9},{r:20, c:10},{r:20, c:11}], block:[{r:19, c:8},{r:19, c:9},{r:19, c:10},{r:19, c:11},{r:20, c:8},{r:20, c:9},{r:20, c:10},{r:20, c:11}], area:[{r:21, c:8},{r:21, c:9},{r:21, c:10},{r:21, c:11}], type:'item', item:8, cost:25, icon:{x:0, y:-69}},
						{id:'veg01', r:16, c:14, mask:[{r:15, c:13},{r:15, c:14},{r:15, c:15},{r:15, c:16},{r:16, c:13},{r:16, c:14},{r:16, c:15},{r:16, c:16}], block:[{r:15, c:13},{r:15, c:14},{r:15, c:15},{r:15, c:16},{r:16, c:13},{r:16, c:14},{r:16, c:15},{r:16, c:16}], area:[{r:17, c:13},{r:17, c:14},{r:17, c:15},{r:17, c:16}], type:'item', item:8, cost:25, icon:{x:0, y:-69}},
						{id:'veg02', r:20, c:14, mask:[{r:19, c:13},{r:19, c:14},{r:19, c:15},{r:19, c:16},{r:20, c:13},{r:20, c:14},{r:20, c:15},{r:20, c:16}], block:[{r:19, c:13},{r:19, c:14},{r:19, c:15},{r:19, c:16},{r:20, c:13},{r:20, c:14},{r:20, c:15},{r:20, c:16}], area:[{r:21, c:13},{r:21, c:14},{r:21, c:15},{r:21, c:16}], type:'item', item:8, cost:25, icon:{x:0, y:-69}},
	
						{id:'gro01', r:7, c:21, mask:[{r:7, c:19},{r:7, c:20},{r:7, c:21},{r:7, c:22},{r:7, c:23}], block:[{r:7, c:19},{r:7, c:20},{r:7, c:21},{r:7, c:22},{r:7, c:23}], area:[{r:8, c:19},{r:8, c:20},{r:8, c:21},{r:8, c:22},{r:8, c:23}], type:'item', item:8, cost:10, lock:{id:'grolock1', cost:1000, name:'DAILY', x:0, y:0, regX:0, regY:50}, icon:{x:5, y:-48}},
						{id:'gro02', r:10, c:29, mask:[{r:8, c:29},{r:9, c:29},{r:10, c:29},{r:11, c:29},{r:12, c:29}], block:[{r:8, c:29},{r:9, c:29},{r:10, c:29},{r:11, c:29},{r:12, c:29}], area:[{r:8, c:28},{r:9, c:28},{r:10, c:28},{r:11, c:28},{r:12, c:28}], type:'item', item:8, cost:10, lock:{id:'grolock2', cost:1000, name:'DAILY', x:0, y:0, regX:0, regY:130}, icon:{x:-5, y:-50}},
						{id:'gro03', r:7, c:26, mask:[{r:7, c:24},{r:7, c:25},{r:7, c:26},{r:7, c:27},{r:7, c:28}], block:[{r:7, c:24},{r:7, c:25},{r:7, c:26},{r:7, c:27},{r:7, c:28}], area:[{r:8, c:24},{r:8, c:25},{r:8, c:26},{r:8, c:27}], type:'item', item:8, cost:10, lock:{id:'grolock1', cost:1000, name:'DAILY', x:0, y:0, regX:0, regY:130}, icon:{x:5, y:-48}},
						{id:'gro04', r:11, c:24, mask:[{r:11, c:22},{r:11, c:23},{r:11, c:24},{r:11, c:25},{r:11, c:26}], block:[{r:11, c:22},{r:11, c:23},{r:11, c:24},{r:11, c:25},{r:11, c:26}], area:[{r:12, c:22},{r:12, c:23},{r:12, c:24},{r:12, c:25},{r:12, c:26}], type:'item', item:8, cost:10, lock:{id:'grolock1', cost:1000, name:'DAILY', x:0, y:0, regX:0, regY:50}, icon:{x:5, y:-48}},
						{id:'gro05', r:15, c:24, mask:[{r:15, c:22},{r:15, c:23},{r:15, c:24},{r:15, c:25},{r:15, c:26}], block:[{r:15, c:22},{r:15, c:23},{r:15, c:24},{r:15, c:25},{r:15, c:26}], area:[{r:16, c:22},{r:16, c:23},{r:16, c:24},{r:16, c:25},{r:16, c:26}], type:'item', item:8, cost:10, lock:{id:'grolock1', cost:1000, name:'DAILY', x:0, y:0, regX:0, regY:0}, icon:{x:5, y:-48}},
						{id:'gro06', r:15, c:29, mask:[{r:13, c:29},{r:14, c:29},{r:15, c:29},{r:16, c:29},{r:17, c:29}], block:[{r:13, c:29},{r:14, c:29},{r:15, c:29},{r:16, c:29},{r:17, c:29}], area:[{r:13, c:28},{r:14, c:28},{r:15, c:28},{r:16, c:28},{r:17, c:28}], type:'item', item:8, cost:10, lock:{id:'grolock2', cost:1000, name:'DAILY', x:0, y:0, regX:0, regY:60}, icon:{x:-5, y:-50}},
	
						{id:'promo01', r:19, c:19, mask:[{r:19, c:19},{r:18, c:19},{r:18, c:20},{r:19, c:20}], block:[{r:19, c:19},{r:18, c:19},{r:18, c:20},{r:19, c:20}], area:[{r:20, c:19},{r:20, c:20},{r:18, c:18},{r:19, c:18},{r:17, c:19},{r:17, c:20},{r:19, c:21},{r:18, c:21}], type:'item', item:8, cost:10, lock:{id:'promolock', cost:500, name:'DAILY', x:-124, y:-74, regX:0, regY:0}, icon:{x:0, y:-45}},
						{id:'promo02', r:15, c:19, mask:[{r:15, c:19},{r:14, c:19},{r:14, c:20},{r:15, c:20}], block:[{r:15, c:19},{r:14, c:19},{r:14, c:20},{r:15, c:20}], area:[{r:16, c:19},{r:16, c:20},{r:15, c:18},{r:14, c:18},{r:13, c:19},{r:13, c:20},{r:14, c:21},{r:15, c:21}], type:'item', item:8, cost:10, lock:{id:'promolock', cost:500, name:'DAILY', x:-56, y:-33, regX:0, regY:0}, icon:{x:0, y:-45}},
						{id:'promo03', r:11, c:19, mask:[{r:11, c:19},{r:10, c:19},{r:10, c:20},{r:11, c:20}], block:[{r:11, c:19},{r:10, c:19},{r:10, c:20},{r:11, c:20}], area:[{r:12, c:19},{r:12, c:20},{r:10, c:18},{r:11, c:18},{r:9, c:19},{r:9, c:20},{r:10, c:21},{r:11, c:21}], type:'item', item:8, cost:10, lock:{id:'promolock', cost:500, name:'DAILY', x:0, y:0, regX:0, regY:0}, icon:{x:0, y:-45}},
						
						{id:'elec01', r:20, c:29, mask:[{r:19, c:29},{r:20, c:29},{r:21, c:29},{r:22, c:29}], block:[{r:19, c:29},{r:20, c:29},{r:21, c:29},{r:22, c:29}], area:[{r:19, c:28},{r:20, c:28},{r:21, c:28},{r:22, c:28}], type:'item', item:8, cost:300, lock:{id:'eleclock1', cost:3000, name:'MACHINE', x:-128, y:-76, regX:0, regY:70}, icon:{x:10, y:-30}},
						{id:'elec01', r:25, c:29, mask:[{r:24, c:29},{r:25, c:29},{r:26, c:29},{r:27, c:29}], block:[{r:24, c:29},{r:25, c:29},{r:26, c:29},{r:27, c:29}], area:[{r:24, c:28},{r:25, c:28},{r:26, c:28},{r:27, c:28}], type:'item', item:8, cost:300, lock:{id:'eleclock1', cost:3000, name:'MACHINE', x:-250, y:-150, regX:0, regY:70}, icon:{x:10, y:-30}},
	
						{id:'elec02', r:20, c:26, mask:[{r:19, c:26},{r:20, c:26},{r:21, c:26},{r:22, c:26}], block:[{r:19, c:26},{r:20, c:26},{r:21, c:26},{r:22, c:26}], area:[{r:19, c:25},{r:20, c:25},{r:21, c:25},{r:22, c:25}], type:'item', item:8, cost:150, lock:{id:'eleclock2', cost:2000, name:'MACHINE', x:-128, y:-76, regX:0, regY:60}, icon:{x:10, y:-30}},
						{id:'elec02', r:25, c:26, mask:[{r:24, c:26},{r:25, c:26},{r:26, c:26},{r:27, c:26}], block:[{r:24, c:26},{r:25, c:26},{r:26, c:26},{r:27, c:26}], area:[{r:24, c:25},{r:25, c:25},{r:26, c:25},{r:27, c:25}], type:'item', item:8, cost:150, lock:{id:'eleclock2', cost:2000, name:'MACHINE', x:-250, y:-150, regX:0, regY:60}, icon:{x:10, y:-30}},
	
						{id:'elec03', r:20, c:23, mask:[{r:19, c:23},{r:20, c:23},{r:21, c:23},{r:22, c:23}], block:[{r:19, c:23},{r:20, c:23},{r:21, c:23},{r:22, c:23}], area:[{r:19, c:22},{r:20, c:22},{r:21, c:22},{r:22, c:22}], type:'item', item:8, cost:100, lock:{id:'eleclock3', cost:2000, name:'MACHINE', x:-128, y:-76, regX:0, regY:50}, icon:{x:10, y:-30}},
						{id:'elec03', r:25, c:23, mask:[{r:24, c:23},{r:25, c:23},{r:26, c:23},{r:27, c:23}], block:[{r:24, c:23},{r:25, c:23},{r:26, c:23},{r:27, c:23}], area:[{r:24, c:22},{r:25, c:22},{r:26, c:22},{r:27, c:22}], type:'item', item:8, cost:100, lock:{id:'eleclock3', cost:2000, name:'MACHINE', x:-250, y:-150, regX:0, regY:50}, icon:{x:10, y:-30}},
	
						{id:'fashion01', r:29, c:29, mask:[{r:29, c:29},{r:30, c:29}], block:[{r:29, c:29},{r:30, c:29}], area:[{r:29, c:28},{r:30, c:28}], type:'item', item:8, cost:60, lock:{id:'fashionlock1', cost:1500, name:'FASHION', x:-400, y:-245, regX:0, regY:100}, icon:{x:15, y:-30}},
						{id:'fashion02', r:32, c:29, mask:[{r:32, c:29},{r:33, c:29}], block:[{r:32, c:29},{r:33, c:29}], area:[{r:32, c:28},{r:33, c:28}], type:'item', item:8, cost:60, lock:{id:'fashionlock2', cost:1500, name:'FASHION', x:-400, y:-245, regX:0, regY:60}, icon:{x:15, y:-30}},
	
						{id:'fashion03', r:29, c:26, mask:[{r:29, c:26},{r:30, c:26}], block:[{r:29, c:26},{r:30, c:26}], area:[{r:29, c:25},{r:30, c:25},{r:29, c:27},{r:30, c:27}], type:'item', item:8, cost:60, lock:{id:'fashionlock3', cost:1200, name:'FASHION', x:-300, y:-180, regX:0, regY:0}, icon:{x:15, y:-28}},
						{id:'fashion03', r:32, c:26, mask:[{r:32, c:26},{r:33, c:26}], block:[{r:32, c:26},{r:33, c:26}], area:[{r:32, c:25},{r:33, c:25},{r:29, c:27},{r:30, c:27}], type:'item', item:8, cost:60, lock:{id:'fashionlock3', cost:1200, name:'FASHION', x:-344, y:-206, regX:0, regY:0}, icon:{x:15, y:-28}},
						{id:'fashion04', r:29, c:23, mask:[{r:29, c:23},{r:30, c:23}], block:[{r:29, c:23},{r:30, c:23}], area:[{r:29, c:22},{r:30, c:22},{r:29, c:24},{r:30, c:24}], type:'item', item:8, cost:75, lock:{id:'fashionlock4', cost:1200, name:'FASHION', x:-300, y:-180, regX:0, regY:0}, icon:{x:15, y:-28}},
						{id:'fashion04', r:32, c:23, mask:[{r:32, c:23},{r:33, c:23}], block:[{r:32, c:23},{r:33, c:23}], area:[{r:32, c:22},{r:33, c:22},{r:32, c:24},{r:33, c:24}], type:'item', item:8, cost:75, lock:{id:'fashionlock4', cost:1200, name:'FASHION', x:-344, y:-206, regX:0, regY:0}, icon:{x:15, y:-28}},
	
						{id:'fence', r:32, c:19, mask:[{r:31, c:19},{r:32, c:19},{r:33, c:19}], block:[{r:31, c:19},{r:32, c:19},{r:33, c:19},{r:34, c:19},{r:35, c:19},{r:36, c:19},{r:37, c:19},{r:38, c:19},{r:39, c:19},{r:40, c:19},{r:41, c:19}], area:[], type:''},
						{id:'cashier02', r:28, c:20, mask:[{r:28, c:20}], block:[{r:28, c:20}], area:[], type:''},
						{id:'cashier01', r:28, c:18, mask:[{r:27, c:18},{r:28, c:18},{r:29, c:18},{r:30, c:18},{r:27, c:19},{r:28, c:19},{r:29, c:19},{r:30, c:19}], block:[{r:27, c:18},{r:28, c:18},{r:29, c:18},{r:30, c:18},{r:27, c:19},{r:28, c:19},{r:29, c:19},{r:30, c:19}], area:[{r:29, c:17},{r:28, c:17},{r:27, c:17},{r:26, c:17},{r:25, c:17},{r:24, c:17},{r:23, c:17},{r:22, c:17}], type:'cashier', icon:{x:40, y:-100}, lock:{id:'cashierlock01', cost:1000, name:'CASHIER', x:-344, y:-206, regX:0, regY:0}},
						{id:'fence', r:29, c:16, mask:[{r:28, c:16},{r:29, c:16},{r:30, c:16}], block:[{r:28, c:16},{r:29, c:16},{r:30, c:16}], area:[], type:''},
						{id:'cashier02', r:28, c:15, mask:[{r:28, c:15}], block:[{r:28, c:15}], area:[], type:''},
						{id:'cashier01', r:28, c:13, mask:[{r:27, c:13},{r:28, c:13},{r:29, c:13},{r:30, c:13},{r:27, c:14},{r:28, c:14},{r:29, c:14},{r:30, c:14}], block:[{r:27, c:13},{r:28, c:13},{r:29, c:13},{r:30, c:13},{r:27, c:14},{r:28, c:14},{r:29, c:14},{r:30, c:14}], area:[{r:29, c:12},{r:28, c:12},{r:27, c:12},{r:26, c:12},{r:25, c:12},{r:24, c:12},{r:23, c:12},{r:22, c:12}], type:'cashier', icon:{x:40, y:-100}},
						{id:'fence', r:29, c:11, mask:[{r:28, c:11},{r:29, c:11},{r:30, c:11}], block:[{r:28, c:11},{r:29, c:11},{r:30, c:11}], area:[], type:''},
	
						{id:'sensor', r:30, c:10, mask:[{r:30, c:10}], block:[{r:30, c:10}], area:[], type:''},
						{id:'sensor', r:30, c:7, mask:[{r:30, c:7}], block:[{r:30, c:7}], area:[], type:''},
						{id:'sensor', r:30, c:4, mask:[{r:30, c:4}], block:[{r:30, c:4}], area:[], type:''},
	
						{id:'restock01', r:1, c:19, mask:[{r:0, c:19},{r:1, c:19},{r:0, c:20},{r:1, c:20}], block:[{r:0, c:19},{r:1, c:19},{r:0, c:20},{r:1, c:20}], area:[{r:2, c:19},{r:2, c:20}], type:'stock', item:8, cost:300, icon:{x:0, y:-80}},
						{id:'restock02', r:1, c:17, mask:[{r:0, c:17},{r:1, c:17},{r:0, c:18},{r:1, c:18}], block:[{r:0, c:17},{r:1, c:17},{r:0, c:18},{r:1, c:18}], area:[{r:2, c:17},{r:2, c:18}], type:'stock', item:8, cost:300, icon:{x:0, y:-80}},
						{id:'restock01', r:1, c:14, mask:[{r:0, c:14},{r:1, c:14},{r:0, c:15},{r:1, c:15}], block:[{r:0, c:14},{r:1, c:14},{r:0, c:15},{r:1, c:15}], area:[{r:2, c:14},{r:2, c:15}], type:'stock', item:8, cost:300, icon:{x:0, y:-80}, lock:{id:'restocklock01', cost:5000, name:'RESTOCK', x:0, y:0, regX:0, regY:0}},
					];

//staff position list
var staff_position_arr = [
							{r:29, c:15, block:[{r:29, c:15}], direction:'l'},
							{r:29, c:20, block:[{r:29, c:20}], direction:'l'},
						];

//peoples array list			
var people_arr = [
					{src:'assets/human_01.png'},
				 	{src:'assets/human_02.png'},
					{src:'assets/human_03.png'},
				 	{src:'assets/human_04.png'},
					{src:'assets/human_05.png'},
					{src:'assets/human_06.png'},
					{src:'assets/human_07.png'},
					{src:'assets/human_08.png'},
					{src:'assets/human_09.png'},
					{src:'assets/human_10.png'}
				 ];

//staff array list			
var staff_arr = [
					{src:'assets/human_staff.png'},
				 ];

//entrance array list
var entrace_arr = {
					apperance:[{r:41, c:14},{r:41, c:15},{r:41, c:16}], //people appearance area
					enter:[{r:30, c:5},{r:30, c:6},{r:30, c:8},{r:30, c:9}], //people enter shop area
					exit:[{r:41, c:14},{r:41, c:15},{r:41, c:16}] //people exit area
				  };

//game settings
var gameSetting = {
					currency:'$', //currency
					money:1000, //starting money
					customerSpeed:[0.2, 0.18, 0.16, 0.14, 0.12], //customer movement speed (array from 1 to 5 star)
					staffSpeed:[0.18, 0.16 ,0.14, 0.12, 0.1], //staff movement speed (array from 1 to 5 star)
					bounceSpeed:[.3,.3,.3,.3,.3], //bounce speed (array from 1 to 5 star)
					customerInTimer:[[3,5],[3,4],[2,3],[1,3],[1,2]], //customer appear timer (array from 1 to 5 star)
					custimerViewItem:[[2,5],[3,6],[4,7],[5,8],[6,10]], //customer view total item (array from 1 to 5 star)
					custimerViewTimer:[[1,2],[1,2],[1,2],[1,2],[1,2]], //customer view timer (array from 1 to 5 star)
					cashierTimer:[[10,12],[9,11],[8,10],[7,9],[6,8]], //cashier register timer (array from 1 to 5 star)
					restockTimer:[[15,17],[14,16],[13,15],[12,14],[11,13]], //restock timer (array from 1 to 5 star)
					profitMultiply:[1,1.2,1.5,1.8,2], //profit multiply (array from 1 to 5 star)
				  };

//test display
var textDisplay = {
					newTitle:'NEW GAME',
					newDesc:'Are you sure you want to start new game?\nAny previous progress will be lost!',
					quitTitle:'QUIT GAME',
					quitDesc:'Are you sure you want to quit game?',
					resultTitle:'DAILY PROFIT',
					resultEarn:'EARN : ',
					resultRate:'RATE : ',
					share:'SHARE YOUR SCORE'
				}
	

//Social share, [SCORE] will replace with game score
var shareEnable = false; //toggle share
var shareTitle = 'Highscore on Tap Supermarket Game is $[SCORE] with [STAR] star rating';//social share score title
var shareMessage = '$[SCORE] with [STAR] star rating is mine new highscore on Tap Supermarket Game! Try it now!'; //social share score message

/*!
 *
 * GAME SETTING CUSTOMIZATION END
 *
 */
var cookieName = 'tapsupermarket2020';
var isometricData = {guide:false, array:[], x:-65, y:459, row:42, column:30, width:25};
var playerData = {score:0};
var gameData = {paused:true, popCase:'', saveData:null};
var tweenData = {score:0, scoreTarget:0, resultScore:0};
var shopData = {instruction:0, rate:0, stallReady:0, stall:[], cashier:[], stock:[], restockqueue:[], stockEmpty:false, peopleNum:0, staffIdleNum:0, staffNum:0, maxPeopleNum:100};
var expandData = {y:-10, animateY:-10, endY:350};
var moveData = {enable:false, move:false, x:0, y:0, stageX:0, stageY:0, width:0, height:0, percentX:60, percentY:140};
var progressData = {radius:12, barRadius:10, innerRadius:5, background:'#024462', bar:'#24bc32'};


/*!
 * 
 * DATA UPDATE - This is the function that runs to update data
 * 
 */
function retrieveLevelData(){
	var previousData = Cookies.get(cookieName);
	if(previousData != undefined){
		gameData.saveData = jQuery.parseJSON(previousData);
	}
}

function saveLevelData(){
	var stallArray = [];
	for(var n=0; n<shopData.stall.length; n++){
		if(position_arr[shopData.stall[n]].lock != null){
			if(!$.interior[shopData.stall[n]].lock){
				stallArray.push(shopData.stall[n]);
			}
		}else{
			stallArray.push(shopData.stall[n]);
		}
	}
	
	for(var n=0; n<shopData.cashier.length; n++){
		if(position_arr[shopData.cashier[n]].lock != null){
			if(!$.interior[shopData.cashier[n]].lock){
				stallArray.push(shopData.cashier[n]);
			}
		}else{
			stallArray.push(shopData.cashier[n]);
		}
	}
	
	for(var n=0; n<shopData.stock.length; n++){
		if(position_arr[shopData.stock[n]].lock != null){
			if(!$.interior[shopData.stock[n]].lock){
				stallArray.push(shopData.stock[n]);
			}
		}else{
			stallArray.push(shopData.stock[n]);
		}
	}
	
	var saveData = {money:playerData.score, stall:stallArray};
	gameData.saveData = saveData;
	Cookies.set(cookieName, gameData.saveData, {expires:360});
}

/*!
 * 
 * GAME BUTTONS - This is the function that runs to setup button event
 * 
 */
function buildGameButton(){
	$(window).focus(function() {
		if(!buttonSoundOn.visible){
			toggleSoundInMute(false);
		}

		if (typeof buttonMusicOn != "undefined") {
			if(!buttonMusicOn.visible){
				toggleMusicInMute(false);
			}
		}
	});
	
	$(window).blur(function() {
		if(!buttonSoundOn.visible){
			toggleSoundInMute(true);
		}

		if (typeof buttonMusicOn != "undefined") {
			if(!buttonMusicOn.visible){
				toggleMusicInMute(true);
			}
		}
	});
	
	buttonNew.cursor = "pointer";
	buttonNew.addEventListener("click", function(evt) {
		playSound('soundButton');
		
		if(gameData.saveData != null){
			togglePop('new');
		}else{
			goPage('game');	
		}
	});
	
	buttonContinue.cursor = "pointer";
	buttonContinue.addEventListener("click", function(evt) {
		playSound('soundButton');
		goPage('game');
	});
	
	buttonArrowL.cursor = "pointer";
	buttonArrowL.addEventListener("click", function(evt) {
		playSound('soundButton');
		toggleWelcome(false);
	});
	
	buttonArrowR.cursor = "pointer";
	buttonArrowR.addEventListener("click", function(evt) {
		playSound('soundButton');
		toggleWelcome(true);
	});
	
	buttonStart.cursor = "pointer";
	buttonStart.addEventListener("click", function(evt) {
		playSound('soundButton');
		startGame();
	});
	
	itemExpand.addEventListener("click", function(evt) {
	});
	
	buttonBuy.cursor = "pointer";
	buttonBuy.addEventListener("click", function(evt) {
		proceedStallPurchase();
	});
	
	buttonFacebook.cursor = "pointer";
	buttonFacebook.addEventListener("click", function(evt) {
		share('facebook');
	});
	buttonTwitter.cursor = "pointer";
	buttonTwitter.addEventListener("click", function(evt) {
		share('twitter');
	});
	buttonWhatsapp.cursor = "pointer";
	buttonWhatsapp.addEventListener("click", function(evt) {
		share('whatsapp');
	});
	
	buttonResultContinue.cursor = "pointer";
	buttonResultContinue.addEventListener("click", function(evt) {
		playSound('soundButton');
		goPage('main');
	});
	
	buttonSoundOff.cursor = "pointer";
	buttonSoundOff.addEventListener("click", function(evt) {
		toggleSoundMute(true);
	});
	
	buttonSoundOn.cursor = "pointer";
	buttonSoundOn.addEventListener("click", function(evt) {
		toggleSoundMute(false);
	});

	if (typeof buttonMusicOff != "undefined") {
		buttonMusicOff.cursor = "pointer";
		buttonMusicOff.addEventListener("click", function(evt) {
			toggleMusicMute(true);
		});
	}
	
	if (typeof buttonMusicOn != "undefined") {
		buttonMusicOn.cursor = "pointer";
		buttonMusicOn.addEventListener("click", function(evt) {
			toggleMusicMute(false);
		});
	}
	
	buttonFullscreen.cursor = "pointer";
	buttonFullscreen.addEventListener("click", function(evt) {
		toggleFullScreen();
	});
	
	buttonExit.cursor = "pointer";
	buttonExit.addEventListener("click", function(evt) {
		togglePop('exit');
	});
	
	buttonSettings.cursor = "pointer";
	buttonSettings.addEventListener("click", function(evt) {
		toggleOption();
	});
	
	buttonYes.cursor = "pointer";
	buttonYes.addEventListener("click", function(evt) {
		if(gameData.popCase == 'new'){
			gameData.saveData = null;
			togglePop();
			goPage('game');
		}else{
			togglePop();
			stopGame();
			goPage('result');
			toggleOption();
		}
	});
	
	buttonNo.cursor = "pointer";
	buttonNo.addEventListener("click", function(evt) {
		togglePop();
	});
	
	buildMapEvents();
	window.addEventListener('blur', function() {
		TweenMax.ticker.useRAF(false);
	}, false);


	window.addEventListener('focus', function() {
		TweenMax.ticker.useRAF(true);
	}, false);
}

/*!
 * 
 * TOGGLE POP - This is the function that runs to toggle popup overlay
 * 
 */
function togglePop(con){
	gameData.popCase = con;
	confirmContainer.visible = true;
	
	if(con == 'new'){
		popTitleTxt.text = textDisplay.newTitle;
		popDescTxt.text = textDisplay.newDesc;
	}else if(con == 'exit'){
		popTitleTxt.text = textDisplay.quitTitle;
		popDescTxt.text = textDisplay.quitDesc;

		if(curPage == 'game'){
			TweenMax.pauseAll(true, true);
			gameData.paused = true;
		}
	}else{
		confirmContainer.visible = false;
		
		if(curPage == 'game'){
			TweenMax.resumeAll(true, true)
			gameData.paused = false;
		}
	}
}


/*!
 * 
 * DISPLAY PAGES - This is the function that runs to display pages
 * 
 */
var curPage=''
function goPage(page){
	curPage=page;
	
	mainContainer.visible = false;
	gameContainer.visible = false;
	resultContainer.visible = false;
	
	var targetContainer = null;
	switch(page){
		case 'main':
			targetContainer = mainContainer;
			playMusicLoop('musicMain');
			
			if(gameData.saveData != null){
				toggleStartButton(false);	
			}else{
				toggleStartButton(true);
			}
		break;
		
		case 'game':
			gameContainer.visible = true;
			stopMusicLoop('musicMain');
			playMusicLoop('musicGame');
			prepareGame();
		break;
		
		case 'result':
			targetContainer = resultContainer;
			stopGame();
			
			stopMusicLoop('musicGame');
			playMusicLoop('musicMain');
			playSound('soundResult');
			tweenData.resultScore = 0;
			TweenMax.to(tweenData, 1, {resultScore:playerData.score, overwrite:true, onUpdate:function(){
				resultScoreTxt.text = gameSetting.currency+addCommas(Math.round(tweenData.resultScore))
			}});
			saveGame(playerData.score);
		break;
	}
	
	if(targetContainer != null){
		targetContainer.visible = true;
		targetContainer.alpha = 0;
		TweenMax.to(targetContainer, .5, {alpha:1, overwrite:true});
	}
	
	resizeCanvas();
}

function toggleStartButton(con){
	buttonContinue.visible = false;
	
	if(!con){
		buttonContinue.x = canvasW/2;
		buttonContinue.y = canvasH/100 * 80;
		buttonContinue.visible = true;
		
		buttonNew.x = canvasW/2;
		buttonNew.y = canvasH/100 * 70;
	}else{
		buttonNew.x = canvasW/2;
		buttonNew.y = canvasH/100 * 75;
	}
}

/*!
 * 
 * START GAME - This is the function that runs to start play game
 * 
 */
function prepareGame(){
	resetGame();
	
	playerData.score = tweenData.score = gameSetting.money;
	if(gameData.saveData != null){
		playerData.score = tweenData.score = gameData.saveData.money;
	}
	
	gameData.paused = true;
	shopData.peopleNum = 0;
	shopData.staffIdleNum = 0;
	shopData.staffNum = 0;
	shopData.stockEmpty = false;
	gameData.soundTimer = false;
	moveData.enable = true;
	
	//reset lock and item
	for(var intNum=0;intNum<position_arr.length;intNum++){
		if($.interior[intNum].progressContainer != null){
			$.interior[intNum].progressContainer.visible = false;;   
		}
		
		var lockCon = true;
		if(position_arr[intNum].lock != null){
			var storeData = {x:$.interior[intNum].x, y:$.interior[intNum].y, r:$.interior[intNum].r, c:$.interior[intNum].c};
			
			if(gameData.saveData != null && gameData.saveData.stall.indexOf(intNum) != -1){
				lockCon = false;
				$.interior[intNum] = $.objects[position_arr[intNum].id].clone();
			}else{
				$.interior[intNum] = $.objects[position_arr[intNum].lock.id].clone();
			}
			
			setInteriorProperty($.interior[intNum], intNum, storeData.x, storeData.y, storeData.r, storeData.c);
			$.interior[intNum].lock = lockCon;
			buildInteriorMask(intNum);
			sortObjectIndex();
		}else{
			lockCon = false;
		}
		
		if(!lockCon){
			if(position_arr[intNum].type == 'stock'){
				$.interior[intNum].totalItem = $.interior[intNum].totalDefaultItem;		
				$.interior[intNum].staffID = undefined;		
				updateInteriorFrame(intNum);
				createInteriorRestock($.interior[intNum], position_arr[intNum].icon);
			}else if(position_arr[intNum].type == 'item'){
				$.interior[intNum].totalItem = $.interior[intNum].totalDefaultItem;		
				updateInteriorFrame(intNum);
				createInteriorRestock($.interior[intNum], position_arr[intNum].icon);
			}else if(position_arr[intNum].type == 'cashier'){
				for(var n=0;n<$.interior[intNum].queueArray.length;n++){
					$.interior[intNum].queueArray[n].index = -1;
				}
			}
		}
	}
	
	//reset human
	for(var n=0; n<staff_position_arr.length; n++){
		createHuman('idle', staff_position_arr[n].r, staff_position_arr[n].c, staff_position_arr[n].direction);
	}
	
	//reset stock staff
	createStockStaff();
	
	if(isometricData.guide){
		createHuman('manager', 10, 10);
	}
	
	toggleStallInfo();
	checkStallAvailable();
	updateScore();
	updateRating();
	
	moveContainer.x = moveContainer.y = 0;
	moveFloor(-520,-332,1);
	displayInstruction(true);
}

/*!
 * 
 * DISPLAY INSTRUCTION - This is the function that runs to display instruction
 * 
 */
function displayInstruction(con){
	instructionContainer.visible = con;
	setWelcome(0);
	
	if(con){
		instructionContainer.alpha = 0;
		TweenMax.to(instructionContainer, .5, {delay:1, alpha:1, overwrite:true});		
	}
}

function toggleWelcome(con){
	if(con){
		shopData.instruction++;
		shopData.instruction = shopData.instruction > instruction_arr.length-1 ? instruction_arr.length-1 : shopData.instruction;
	}else{
		shopData.instruction--;
		shopData.instruction = shopData.instruction < 0 ? 0 : shopData.instruction;
	}
	
	setWelcome(shopData.instruction);
}

function setWelcome(num){
	shopData.instruction = num;
	for(n=0;n<instruction_arr.length;n++){
		$.welcome[n].visible = false;
	}
	$.welcome[num].visible = true;
	$.welcome[num].addEventListener("click", function(evt) {
		
	});
}

/*!
 * 
 * START GAME - This is the function that runs to start game
 * 
 */
function startGame(){
	gameData.paused = false;
	instructionContainer.visible = false;
	
	startCustomerTimer();
	saveLevelData()
}

 /*!
 * 
 * STOP GAME - This is the function that runs to stop play game
 * 
 */
function stopGame(){
	gameData.paused = true;
	TweenMax.killAll(false, true, false);
}

function resetGame(){
	iconContainer.removeAllChildren();
	
	//reset human
	for(var i=0; i<shopData.peopleNum; i++) {
		objectsContainer.removeChild($.peopleList[i]);
    }
	for(var i=0; i<shopData.staffIdleNum; i++) {
		objectsContainer.removeChild($.peopleList['idle_'+i]);
    }
	for(var i=0; i<shopData.staffNum; i++) {
		objectsContainer.removeChild($.peopleList['staff_'+i]);
    }	
}

function saveGame(score){
	if ( typeof toggleScoreboardSave == 'function' ) { 
		$.scoreData.score = score;
		if(typeof type != 'undefined'){
			$.scoreData.type = type;	
		}
		toggleScoreboardSave(true);
	}

	/*$.ajax({
      type: "POST",
      url: 'saveResults.php',
      data: {score:score},
      success: function (result) {
          console.log(result);
      }
    });*/
}


/*!
 * 
 * UPDATE GAME - This is the function that runs to loop game update
 * 
 */
function updateGame(){
	if(!gameData.paused){
		
	}
}

/*!
 * 
 * ISOMETRIC MAP - This is the function that runs to build isometric map
 * 
 */
function createIsometricMap(){
	var startX = isometricData.x;
	var startY = isometricData.y;
	var conX = startX;
	var conY = startY;
	var isoNum = 0;
	
	isometricData.height = Math.round(isometricData.width / 1.7241);
	shopData.stall = [];
	shopData.cashier = [];
	shopData.stock = [];
	shopData.restockqueue = [];
	
	var spaceW = isometricData.width / 1.0;
	var spaceH = isometricData.height / 1.04;
	
	for(var row = 0; row < isometricData.row; row++){
		conX = startX + ((spaceW) * row);
		conY = startY + ((spaceH) * row);
		
		isometricData.array[row] = [];
		for(var column = 0; column < isometricData.column; column++){
			var newISO = new createjs.Shape();
			newISO.graphics.beginStroke("green").beginFill("#ccff00");
			newISO.graphics.moveTo(0, -(isometricData.height));
			newISO.graphics.lineTo((isometricData.width), 0);
			newISO.graphics.lineTo(0, (isometricData.height));
			newISO.graphics.lineTo(-(isometricData.width), 0);
			newISO.graphics.lineTo(0, -(isometricData.height));
			newISO.alpha = .2;
			
			newISO.x = conX;
			newISO.y = conY;
			newISO.r = row;
			newISO.c = column;
			newISO.walkable = true;
			isometricData.array[row][column] = newISO;
			if(!isometricData.guide){
				newISO.visible = false;	
			}
			
			for(var intNum=0;intNum<position_arr.length;intNum++){
				if(row == position_arr[intNum].r && column == position_arr[intNum].c){
					if(position_arr[intNum].lock != null){
						$.interior[intNum] = $.objects[position_arr[intNum].lock.id].clone();	
					}else{
						$.interior[intNum] = $.objects[position_arr[intNum].id].clone();
					}
					objectsContainer.addChild($.interior[intNum]);
					setInteriorProperty($.interior[intNum], intNum, conX, conY, row, column);
					if(position_arr[intNum].type == 'stock'){
						shopData.stock.push(intNum);
						//createInteriorProgress($.interior[intNum], position_arr[intNum].icon);
					}else if(position_arr[intNum].type == 'cashier'){
						shopData.cashier.push(intNum);
						//createInteriorProgress($.interior[intNum], position_arr[intNum].icon);
					}else if(position_arr[intNum].type == 'item'){
						shopData.stall.push(intNum);
					}
					buildInteriorEvent($.interior[intNum]);
				}
			}
			
			newISO.cursor = "pointer";
			newISO.addEventListener("click", function(evt) {
				var targetISO = isometricData.array[evt.target.r][evt.target.c];
				console.log(evt.target.r, evt.target.c);
				generatePath('manager', evt.target.r, evt.target.c);
			});
						
			conX += spaceW;
			conY -= spaceH;
			isoNum++;
			
			mapContainer.addChild(newISO);
		}
	}
	
	//additional slot and staff
	for(var intNum=0;intNum<position_arr.length;intNum++){
		if(typeof position_arr[intNum].mask != 'undefined'){
			if(position_arr[intNum].mask.length > 0){
				buildInteriorMask(intNum);
			}
		}
	}
}

function setInteriorProperty(interiorObj, intNum, conX, conY, row, column){
	interiorObj.cache(0,0,$.objects[position_arr[intNum].id].oriW,$.objects[position_arr[intNum].id].oriH);
	interiorObj.r = row;
	interiorObj.c = column;
	interiorObj.x = conX;
	interiorObj.y = conY;
	interiorObj.type = position_arr[intNum].type;
	interiorObj.oriID = intNum;
	
	//if lock
	interiorObj.lock = false;
	if(position_arr[intNum].lock != null){
		interiorObj.lock = true;
		interiorObj.lockcost = position_arr[intNum].lock.cost;
		interiorObj.lockname = position_arr[intNum].lock.name;
	}

	if(position_arr[intNum].type == 'stock'){
		interiorObj.stockActive = false;
		interiorObj.totalDefaultItem = position_arr[intNum].item;
		interiorObj.totalItem = position_arr[intNum].item;
		interiorObj.totalFrames = $.objects[position_arr[intNum].id].totalFrames;
		createInteriorRestock(interiorObj, position_arr[intNum].icon);
		createInteriorProgress(interiorObj, position_arr[intNum].icon);
	}else if(position_arr[intNum].type == 'cashier'){
		interiorObj.queueArray = [];
		for(var areaNum=0;areaNum<position_arr[intNum].area.length;areaNum++){
			interiorObj.queueArray.push({r:position_arr[intNum].area[areaNum].r, c:position_arr[intNum].area[areaNum].c, index:-1});
		}
		createInteriorProgress(interiorObj, position_arr[intNum].icon);
	}else if(position_arr[intNum].type == 'item'){
		interiorObj.totalDefaultItem = position_arr[intNum].item;
		interiorObj.totalItem = position_arr[intNum].item;
		interiorObj.totalFrames = $.objects[position_arr[intNum].id].totalFrames;
		createInteriorRestock(interiorObj, position_arr[intNum].icon);
	}
}

/*!
 * 
 * STALL AVAILABLE - This is the function that runs to check stall available
 * 
 */
function checkStallAvailable(){
	shopData.stallReady = 0;
	shopData.stockReady = 0;
	shopData.cashierReady = 0;
	
	for(var n=0; n<shopData.stall.length; n++){
		if(!$.interior[shopData.stall[n]].lock){
			shopData.stallReady++;
		}
	}
	
	for(var n=0; n<shopData.cashier.length; n++){
		if(!$.interior[shopData.cashier[n]].lock){
			shopData.cashierReady++;
		}
	}
	
	for(var n=0; n<shopData.stock.length; n++){
		if(!$.interior[shopData.stock[n]].lock){
			shopData.stockReady++;
		}
	}
}

/*!
 * 
 * INTERIOR PROGRESS - This is the function that runs to create interior progress
 * 
 */
function createInteriorProgress(interiorObj, data){
	interiorObj.progressShape = new createjs.Shape();
	interiorObj.progressMax = 20;
	interiorObj.progressCount = 0;
	interiorObj.progressShape.x = interiorObj.x + data.x;
	interiorObj.progressShape.y = interiorObj.y + data.y;
	
	var background = new createjs.Shape();
	background.graphics.beginFill(progressData.background).drawCircle(0, 0, progressData.radius);
	background.x = interiorObj.progressShape.x;
	background.y = interiorObj.progressShape.y;
	
	var innerBackground = new createjs.Shape();
	innerBackground.graphics.beginFill(progressData.background).drawCircle(0, 0, progressData.innerRadius);
	innerBackground.x = interiorObj.progressShape.x;
	innerBackground.y = interiorObj.progressShape.y;
	
	var intContainer = new createjs.Container();
	intContainer.visible = false;
	interiorObj.progressContainer = intContainer;
	
	intContainer.addChild(background, interiorObj.progressShape, innerBackground);
	progressContainer.addChild(intContainer);
}

function drawProgress(interiorObj){
	var progressCount = interiorObj.progressMax - interiorObj.progressCount;
	var numberAngle = Number(-1.55 - (Math.PI * 2 * ((interiorObj.progressMax-progressCount) / interiorObj.progressMax)));
	var endAngle = Number(numberAngle + (Math.PI * 2 * ((interiorObj.progressMax-progressCount) / interiorObj.progressMax)));
	
	interiorObj.progressShape.graphics.clear();
	interiorObj.progressShape.graphics.beginFill(progressData.bar);
	interiorObj.progressShape.graphics.moveTo(0, 0).arc(0, 0, progressData.barRadius, numberAngle, endAngle, false).lineTo(0, 0).closePath();
}

/*!
 * 
 * ISOMETRIC RESTOCK ICON - This is the function that runs to build interior restock icon
 * 
 */
function createInteriorRestock(interiorObj, data){
	if(data == null){
		data = {x:0, y:0};
	}
	var restockIcon = itemRestock.clone();
	restockIcon.x = interiorObj.x + data.x;
	restockIcon.y = interiorObj.y + data.y;
	restockIcon.visible = false;
	interiorObj.icon = restockIcon;
	interiorObj.iconMove = new TimelineMax({repeat:-1});
  	interiorObj.iconMove.to(interiorObj.icon, 1, {rotation:180}).to(interiorObj.icon, 1, {rotation:0});
	
	iconContainer.addChild(restockIcon);
}

/*!
 * 
 * INTERIOR MASK - This is the function that runs to build interior mask
 * 
 */
function buildInteriorMask(intNum){
	for(var maskNum=0; maskNum<position_arr[intNum].mask.length; maskNum++){
		if($.interior[intNum+'_'+maskNum] != null){
			objectsContainer.removeChild($.interior[intNum+'_'+maskNum]);
			$.interior[intNum+'_'+maskNum] = null;
		}
		
		var seqNum = position_arr[intNum].seq;
		seqNum = isNaN(seqNum) ? 0 : seqNum;
		$.interior[intNum].visible = true;
		$.interior[intNum+'_'+maskNum] = $.interior[intNum].clone();
		$.interior[intNum+'_'+maskNum].r = position_arr[intNum].mask[maskNum].r;
		$.interior[intNum+'_'+maskNum].c = position_arr[intNum].mask[maskNum].c;
		var maskShape = new createjs.Shape();
		var targetISO = isometricData.array[position_arr[intNum].mask[maskNum].r][position_arr[intNum].mask[maskNum].c];

		var totalHeight = 200;
		var maskData = {width:isometricData.width, height:isometricData.height};
		maskShape.graphics.beginFill("#FF0000").drawRect(-(maskData.width), -(totalHeight), maskData.width*2, totalHeight + maskData.height);
		maskShape.x = targetISO.x;
		maskShape.y = targetISO.y+seqNum;

		var regX = Number(targetISO.x - $.interior[intNum+'_'+maskNum].x);
		var regY = Number(targetISO.y - $.interior[intNum+'_'+maskNum].y);
		$.interior[intNum+'_'+maskNum].x = targetISO.x;
		$.interior[intNum+'_'+maskNum].y = targetISO.y+seqNum;
		$.interior[intNum+'_'+maskNum].mask = maskShape;
		$.interior[intNum+'_'+maskNum].regX += regX;
		$.interior[intNum+'_'+maskNum].regY += regY;
		$.interior[intNum+'_'+maskNum].type = position_arr[intNum].type;
		$.interior[intNum+'_'+maskNum].oriID = intNum;

		buildInteriorEvent($.interior[intNum+'_'+maskNum]);
		objectsContainer.addChild($.interior[intNum+'_'+maskNum]);
	}
	$.interior[intNum].visible = false;
}

/*!
 * 
 * INTERIOR OBJECT - This is the function that runs for interior object events
 * 
 */
 
function buildInteriorEvent(interiorObj){
	interiorObj.cursor = "pointer";
	interiorObj.addEventListener("click", function(evt) {
		checkInteriorObjAction(evt.target);
	});
}

function checkInteriorObjAction(interiorObj){
	switch(interiorObj.type){
		case 'item':
			if($.interior[interiorObj.oriID].lock){
				expandNameTxt.text = $.interior[interiorObj.oriID].lockname;
				expandCostTxt.text = gameSetting.currency + addCommas($.interior[interiorObj.oriID].lockcost);
				expandData.cost = $.interior[interiorObj.oriID].lockcost;
				expandData.oriID = interiorObj.oriID;
					
				toggleStallInfo(true, $.interior[interiorObj.oriID].x, $.interior[interiorObj.oriID].y);
			}else{
				updateRestockQueue(interiorObj.oriID, true);
			}
		break;
			
		case 'stock':
			if($.interior[interiorObj.oriID].lock){
				expandNameTxt.text = $.interior[interiorObj.oriID].lockname;
				expandCostTxt.text = gameSetting.currency + addCommas($.interior[interiorObj.oriID].lockcost);
				expandData.cost = $.interior[interiorObj.oriID].lockcost;
				expandData.oriID = interiorObj.oriID;
					
				toggleStallInfo(true, $.interior[interiorObj.oriID].x, $.interior[interiorObj.oriID].y);
			}else{
				if(!$.interior[interiorObj.oriID].progressContainer.visible && $.interior[interiorObj.oriID].totalItem <= 0){
					if(position_arr[interiorObj.oriID].cost * gameSetting.profitMultiply[shopData.rate] <= playerData.score){
						$.interior[interiorObj.oriID].icon.visible = false;
						$.interior[interiorObj.oriID].iconMove.kill();
						increaseScore(position_arr[interiorObj.oriID].cost * gameSetting.profitMultiply[shopData.rate], false);
						$.interior[interiorObj.oriID].progressContainer.visible = true;
						$.interior[interiorObj.oriID].progressCount = 0;

						playSound('soundTap');
						var restockSpeed = randomIntFromInterval(gameSetting.restockTimer[shopData.rate][0], gameSetting.restockTimer[shopData.rate][1]);
						TweenMax.to(interiorObj, restockSpeed, {overwrite:true, onComplete:function(){
							$.interior[interiorObj.oriID].progressContainer.visible = false;
							playSound('soundDeliver');
							updateStock(interiorObj.oriID, false);
							checRestockQueue();
						}});
						TweenMax.to($.interior[interiorObj.oriID], restockSpeed, {progressCount:$.interior[interiorObj.oriID].progressMax, overwrite:true, ease:Linear.easeNone, onUpdate:drawProgress, onUpdateParams:[$.interior[interiorObj.oriID]]});
					}else{
						//not enough cost
					}
				}
			}
		break;
			
		case 'cashier':
			if($.interior[interiorObj.oriID].lock){
				expandNameTxt.text = $.interior[interiorObj.oriID].lockname;
				expandCostTxt.text = gameSetting.currency + addCommas($.interior[interiorObj.oriID].lockcost);
				expandData.cost = $.interior[interiorObj.oriID].lockcost;
				expandData.oriID = interiorObj.oriID;
					
				toggleStallInfo(true, $.interior[interiorObj.oriID].x, $.interior[interiorObj.oriID].y);
			}else{
				if($.interior[interiorObj.oriID].progressContainer.visible){
					TweenMax.killTweensOf($.interior[interiorObj.oriID]);
					TweenMax.killTweensOf($.peopleList[$.interior[interiorObj.oriID].queueArray[0].index]);
					nextHumanAction($.interior[interiorObj.oriID].queueArray[0].index,'paid')
				}
			}
		break;
	}
}

/*!
 * 
 * RESTOCK QUEUE - This is the function that runs to update restock queue
 * 
 */
function updateRestockQueue(id, con){
	if(con){
		if($.interior[id].totalItem <= 0 && $.interior[id].icon.visible){
			if(shopData.restockqueue.indexOf(id) == -1){
				playSound('soundTap');
				$.interior[id].icon.visible = false;
				$.interior[id].iconMove.kill();
				shopData.restockqueue.push(id);
			}
			checRestockQueue();
		}
	}else{
		var findIndex = shopData.restockqueue.indexOf(id);
		if(findIndex != -1){
			shopData.restockqueue.splice(findIndex, 1);
		}
	}
}

function checRestockQueue(){
	for(var n=0; n<shopData.restockqueue.length; n++){
		startRestock(shopData.restockqueue[n]);
	}
}

function startRestock(intID){
	var currentStockIndex = findStockIndex();
	if(currentStockIndex == -1){
		//no stock and not available
		if(shopData.stockEmpty){
		   moveFloor(0,0,1);
		}
	}else{
		var stockStaffID = $.interior[currentStockIndex].staffID;
		$.interior[currentStockIndex].stockActive = true;
		$.peopleList['staff_'+stockStaffID].stockID = currentStockIndex;
		$.peopleList['staff_'+stockStaffID].intID = intID;
		nextHumanAction('staff_'+stockStaffID, 'stock');
	}
}

function findStockIndex(){
	var stockArray = [];
	var stockEmpty = []
	
	for(var n=0; n<shopData.stock.length; n++){
		if(!$.interior[shopData.stock[n]].lock){
			if($.interior[shopData.stock[n]].totalItem > 0){
				stockEmpty.push(shopData.stock[n]);
				if(!$.interior[shopData.stock[n]].stockActive){
					stockArray.push(shopData.stock[n]);
				}
			}
		}
	}
	
	shopData.stockEmpty = false;
	if(stockEmpty.length == 0){
	   //no stock
		shopData.stockEmpty = true;
	}
	
	if(stockArray.length == 0){
		return -1;
	}else{
		shuffle(stockArray);
		return stockArray[0];
	}
}

/*!
 * 
 * PURCHASE STALL - This is the function that runs for purchase stall
 * 
 */
function toggleStallInfo(con,x,y){
	if(con){
		playSound('soundPop');
		expandContainer.x = x + position_arr[expandData.oriID].lock.regX;
		expandContainer.y = (y + expandData.animateY) + position_arr[expandData.oriID].lock.regY;
		expandContainer.visible = true;
		expandContainer.alpha = 0;
		
		TweenMax.to(expandContainer, .5, {alpha:1, y:(y + expandData.y)+position_arr[expandData.oriID].lock.regY, overwrite:true});
		checkStallPurchase();
		moveFloor(position_arr[expandData.oriID].lock.x, position_arr[expandData.oriID].lock.y, 1);
	}else{
		expandContainer.visible = false;
	}
}

function checkStallPurchase(){
	if(playerData.score >= expandData.cost){
		buttonBuy.visible = true;
	}else{
		buttonBuy.visible = false;
	}
}

function proceedStallPurchase(){
	playSound('soundPurchase');
	increaseScore(expandData.cost, false);
	
	var storeData = {x:$.interior[expandData.oriID].x, y:$.interior[expandData.oriID].y, r:$.interior[expandData.oriID].r, c:$.interior[expandData.oriID].c};
	$.interior[expandData.oriID] = $.objects[position_arr[expandData.oriID].id].clone();

	setInteriorProperty($.interior[expandData.oriID], expandData.oriID, storeData.x, storeData.y, storeData.r, storeData.c);
	$.interior[expandData.oriID].lock = false;
	
	createStockStaff();
	buildInteriorMask(expandData.oriID);
	sortObjectIndex();
	toggleStallInfo();
	checkStallAvailable();
	updateRating();
	saveLevelData();
}


/*!
 * 
 * MAP MOVE EVENTS - This is the function that runs for map movement
 * 
 */
function buildMapEvents(){
	stage.on("stagemousedown", function(event) {
		toggleMapEvent(event, 'drag')
	})                
	
	stage.on("stagemouseup", function(event) {
		toggleMapEvent(event, 'release')
	})
	
	stage.on("stagemousemove",function(evt) {
		toggleMapEvent(event, 'move')
	})
}

function toggleMapEvent(obj, con){
	switch(con){
		case 'drag':
			if(gameData.paused){
				return;
			}
			
			if(!moveData.enable){
				return;
			}
			
			moveData.stageX = stage.mouseX;
			moveData.stageY = stage.mouseY;
			
			moveData.moveX = moveData.x;
			moveData.moveY = moveData.y;
			
			moveData.move = true;
		break;
		
		case 'move':
			if(gameData.paused){
				return;
			}
			
			if(!moveData.enable){
				return;
			}
			
			if(moveData.move){
				var borderStartX = 0;
				borderStartX = -(Math.abs(moveData.y)/100 * moveData.percentY);
				moveData.x = moveData.moveX + (stage.mouseX - moveData.stageX);
				moveData.x = moveData.x >= borderStartX ? borderStartX : moveData.x;
				moveData.x = moveData.x <= -(moveData.width-canvasW) ? -(moveData.width-canvasW) : moveData.x;
				
				var borderStartY = 0;
				borderStartY = -(Math.abs(moveData.x)/100 * moveData.percentX);
				moveData.y = moveData.moveY + (stage.mouseY - moveData.stageY);
				moveData.y = moveData.y >= borderStartY ? borderStartY : moveData.y;
				moveData.y = moveData.y <= -(moveData.height-canvasH) ? -(moveData.height-canvasH) : moveData.y;
				
				TweenMax.to(moveContainer, .2, {x:moveData.x, y: moveData.y, overwrite:true});
				toggleStallInfo();
			}
		break;
		
		case 'release':
			moveData.move = false;
		break;
	}
}

function moveFloor(x,y,speed){
	moveData.x = x;
	moveData.y = y;
	
	var borderStartX = 0;
	borderStartX = -(Math.abs(moveData.y)/100 * moveData.percentY);
	moveData.x = moveData.x >= borderStartX ? borderStartX : moveData.x;
	moveData.x = moveData.x <= -(moveData.width-canvasW) ? -(moveData.width-canvasW) : moveData.x;

	var borderStartY = 0;
	borderStartY = -(Math.abs(moveData.x)/100 * moveData.percentX);
	moveData.y = moveData.y >= borderStartY ? borderStartY : moveData.y;
	moveData.y = moveData.y <= -(moveData.height-canvasH) ? -(moveData.height-canvasH) : moveData.y;
	
	if(speed > 0){
		moveData.enable = false;
		TweenMax.to(moveContainer, speed, {x:moveData.x, y: moveData.y, overwrite:true, onComplete:function(){
			moveData.enable = true;
		}});
	}else{
		moveContainer.x = moveData.x;
		moveContainer.y = moveData.y;
	}
}
/*!
 * 
 * CREATE GRID - This is the function that runs to create grid
 * 
 */

function createGrid(){
	grid_arr = new PF.Grid(isometricData.row, isometricData.column);
	var isoNum = 0;
	for(var row = 0; row < isometricData.row; row++){
		for(var column = 0; column < isometricData.column; column++){
			for(var intNum = 0; intNum < position_arr.length; intNum++){
				var blockArray = position_arr[intNum].block;
				for(var bNum = 0; bNum < blockArray.length; bNum++){
					if(row == blockArray[bNum].r && column == blockArray[bNum].c){
						var targetISO = isometricData.array[row][column];
						targetISO.walkable = false;
						grid_arr.setWalkableAt(row, column, false);
					}
				}
			}
			isoNum++;
		}
	}
}

/*!
 * 
 * CUSTOMER IN TIMER - This is the function that runs to set customer in
 * 
 */
function startCustomerTimer(){
	var timerNum = randomIntFromInterval(gameSetting.customerInTimer[shopData.rate][0], gameSetting.customerInTimer[shopData.rate][1]);
	TweenMax.to(shopData, timerNum, {overwrite:true, onComplete:updateCustimerTimer});
}

function updateCustimerTimer(){
	createHuman('customer');
	startCustomerTimer();
}

/*!
 * 
 * GENERATE PATH - This is the function that runs to generate path
 * 
 */
 
function generatePath(num, r, c){
	createGrid();
	
	//reset
	$.peopleList[num].path_arr = [];
	var finder = new PF.AStarFinder({
		allowDiagonal: false
	});
	
	$.peopleList[num].path_arr = finder.findPath($.peopleList[num].r, $.peopleList[num].c, r, c, grid_arr);
	
	if($.peopleList[num].path_arr.length == 0){
		updateHumanAction(num);
	}else{
		$.peopleList[num].r = r;
		$.peopleList[num].c = c;
		$.peopleList[num].pathNum = 1;
		moveHuman(num);
	}
}

/*!
 * 
 * CREATE HUMAN - This is the function that runs to create human
 * 
 */
function createHuman(type, r, c, direction){
	var newHuman;
	newHuman = new createjs.Container();
	newHuman.isStaff = false;
	
	if(type == 'manager'){
		//newHuman = $.peoples[0].clone();
		newHuman.innerHuman = $.peoples[0].clone();
		newHuman.innerHuman.x = newHuman.innerHuman.y = 0;
		newHuman.addChild(newHuman.innerHuman);
		newHuman.r = newHuman.nextR = newHuman.faceR = r;
		newHuman.c = newHuman.nextC = newHuman.faceC = c;
		$.peopleList['manager'] = newHuman;
	}else if(type == 'idle'){
		newHuman.innerHuman = $.peoples['staff_'+0].clone();
		newHuman.innerHuman.x = newHuman.innerHuman.y = 0;
		newHuman.addChild(newHuman.innerHuman);
		newHuman.r = newHuman.nextR = r;
		newHuman.c = newHuman.nextC = c;
		$.peopleList['idle_'+shopData.staffIdleNum] = newHuman;
		shopData.staffIdleNum++;
	}else if(type == 'staff'){
		newHuman.innerHuman = $.peoples['staff_'+0].clone();
		newHuman.innerHuman.x = newHuman.innerHuman.y = 0;
		newHuman.addChild(newHuman.innerHuman);
		newHuman.r = newHuman.nextR = r;
		newHuman.c = newHuman.nextC = c;
		newHuman.isStaff = true;
		$.peopleList['staff_'+shopData.staffNum] = newHuman;
		shopData.staffNum++;
	}else{
		var randomNum = Math.floor(Math.random()*(people_arr.length));
		newHuman.innerHuman = $.peoples[randomNum].clone();
		newHuman.innerHuman.x = newHuman.innerHuman.y = 0;
		
		var angry = itemAngry.clone();
		angry.y = -70;
		angry.visible = false;
		newHuman.angry = angry;
		newHuman.addChild(newHuman.innerHuman, angry);
		
		var randomPos = Math.floor(Math.random()*entrace_arr.apperance.length);
		newHuman.r = newHuman.nextR = entrace_arr.apperance[randomPos].r;
		newHuman.c = newHuman.nextC = entrace_arr.apperance[randomPos].c;
		$.peopleList[shopData.peopleNum] = newHuman;
	}
	
	 newHuman.humanMove = new TimelineMax({repeat:-1});
  	 newHuman.humanMove.to(newHuman.innerHuman, gameSetting.bounceSpeed[shopData.rate], {y:-5}).to(newHuman.innerHuman, gameSetting.bounceSpeed[shopData.rate], {y:0});
	
	var targetISO = isometricData.array[newHuman.r][newHuman.c];
	newHuman.x = targetISO.x;
	newHuman.y = targetISO.y;
	newHuman.action = '';
	newHuman.tweenComplete = false;
	newHuman.type = 'human';
	newHuman.shopData = {};
	newHuman.path_arr = [];
	newHuman.pathNum = 0;
	newHuman.carryStock = false;
	newHuman.randomSpeed = (Math.random()*5)*.01;
	newHuman.innerHuman.x = randomIntFromInterval(-5,5);
	if(newHuman.angry != null){
		newHuman.angry.x = newHuman.innerHuman.x;
	}
	
	objectsContainer.addChild(newHuman);
	sortObjectIndex();
	
	if(direction != null){
		newHuman.direction = direction;
		updateHumanPos(newHuman)
	}
	
	if(type == 'customer'){
		var maxVisited = randomIntFromInterval(gameSetting.custimerViewItem[shopData.rate][0], gameSetting.custimerViewItem[shopData.rate][1]);
		maxVisited = maxVisited > shopData.stallReady ? shopData.stallReady : maxVisited;
		newHuman.shopData.purchase = 0;
		newHuman.shopData.maxVisited = maxVisited;
		newHuman.shopData.visited = [];
		
		nextHumanAction(shopData.peopleNum, 'enter');
		shopData.peopleNum++;
		shopData.peopleNum = shopData.peopleNum > shopData.maxPeopleNum ? 0 : shopData.peopleNum;
	}
}

function createStockStaff(){
	for(var intNum=0;intNum<position_arr.length;intNum++){
		if($.interior[intNum].lock == false){
			if(position_arr[intNum].type == 'stock'){
				if($.interior[intNum].staffID == undefined){
					var randomAreaIndex = Math.floor(Math.random()*(position_arr[intNum].area.length));
					$.interior[intNum].staffID = shopData.staffNum;
					createHuman('staff', position_arr[intNum].area[randomAreaIndex].r, position_arr[intNum].area[randomAreaIndex].c);
				}
			}
		}
	}
}

function showAngryFace(humanObj){
	humanObj.angry.visible = true;
}

/*!
 * 
 * MOVE HUMAN - This is the function that runs to move human
 * 
 */
function moveHuman(num){
	sortObjectIndex();
	
	var targetHuman = $.peopleList[num];
	targetHuman.tweenComplete = true;
	
	if($.peopleList[num].pathNum < $.peopleList[num].path_arr.length){
		var x = Number($.peopleList[num].path_arr[$.peopleList[num].pathNum][0]);
		var y = Number($.peopleList[num].path_arr[$.peopleList[num].pathNum][1]);
		var targetISO = isometricData.array[x][y];
		targetHuman.nextR = targetISO.r;
		targetHuman.nextC = targetISO.c;
		targetHuman.oldX = targetHuman.x;
		targetHuman.oldY = targetHuman.y;
		targetHuman.newX = targetISO.x;
		targetHuman.newY = targetISO.y;
		targetHuman.distance = getDistance(targetHuman.oldX, targetHuman.oldY, targetHuman.newX, targetHuman.newY);
		targetHuman.sortIndex = false;
		targetHuman.direction = getDirection(targetHuman.oldX, targetHuman.oldY, targetHuman.newX, targetHuman.newY);
		targetHuman.tweenComplete = false;
		updateHumanPos(targetHuman);
		
		$.peopleList[num].pathNum++;
		var moveSpeed = targetHuman.isStaff == true ? (gameSetting.staffSpeed[shopData.rate]) : gameSetting.customerSpeed[shopData.rate] + targetHuman.randomSpeed;
		TweenMax.to(targetHuman, moveSpeed, {x:targetHuman.newX, y:targetHuman.newY+2, overwrite:true, onUpdate:updateHumanMove, onUpdateParams:[targetHuman], onComplete:moveHuman, onCompleteParams:[num], ease:Linear.easeNone});
	}else{
		updateHumanAction(num);
	}
}

/*!
 * 
 * UPDATE HUMAN DIRECTION - This is the function that runs to update human direction
 * 
 */
function updateHumanPos(targetHuman){	
	if(targetHuman.carryStock){
		targetHuman.innerHuman.gotoAndStop('c'+targetHuman.direction);
	}else{
		targetHuman.innerHuman.gotoAndStop(targetHuman.direction);
	}
}

function updateHumanMove(obj){
	var percent = 1;
	if(obj.direction == 'u'){
		percent = 1;
	}else if(obj.direction == 'd'){
		percent = 1;
	}else if(obj.direction == 'l'){
		percent = 2;
	}else if(obj.direction == 'r'){
		percent = 5;
	}
	
	if(getDistance(obj.x, obj.y, obj.newX, obj.newY) < (obj.distance/percent) && !obj.sortIndex){
		obj.sortIndex = true;
		obj.r = obj.nextR;
		obj.c = obj.nextC;
		sortObjectIndex();
	}
}

/*!
 * 
 * UPDATE HUMAN ACTION - This is the function that runs to update human action
 * 
 */
function nextHumanAction(num, action){
	switch(action){
		case 'enter':
			var randomPos = Math.floor(Math.random()*entrace_arr.enter.length);
			$.peopleList[num].faceR = entrace_arr.enter[randomPos].r;
			$.peopleList[num].faceC = entrace_arr.enter[randomPos].c;
			
			findPath(num, entrace_arr.enter[randomPos].r, entrace_arr.enter[randomPos].c, true, action);
		break;
			
		case 'gostall':
			var stallIndex = findStallIndex(num);
			if(stallIndex != -1){
				var randomAreaIndex = Math.floor(Math.random()*(position_arr[stallIndex].area.length));

				$.peopleList[num].intID = stallIndex;
				$.peopleList[num].faceR = position_arr[stallIndex].r;
				$.peopleList[num].faceC = position_arr[stallIndex].c;

				findPath(num, position_arr[stallIndex].area[randomAreaIndex].r, position_arr[stallIndex].area[randomAreaIndex].c, true, action);
			}else{
				nextHumanAction(num,'cashier');
			}
		break;
			
		case 'takeitem':
			playSound('soundTake');
			updateStall($.peopleList[num], true);
			
			if($.peopleList[num].shopData.maxVisited <= 0){
				if($.peopleList[num].shopData.purchase == 0){
					showAngryFace($.peopleList[num]);
					nextHumanAction(num, 'leave');
				}else{
					nextHumanAction(num,'cashier');
				}
			}else{
				nextHumanAction(num,'gostall');
			}
		break;
			
		case 'cashier':
			//var cashierIndex = Math.floor(Math.random()*shopData.cashier.length);
			//cashierIndex = shopData.cashier[cashierIndex];
			var cashierIndex = findCashierIndex();
			
			$.peopleList[num].intID = cashierIndex;
			$.peopleList[num].faceR = position_arr[cashierIndex].r;
			$.peopleList[num].faceC = position_arr[cashierIndex].c;
			
			var lastAreaIndex = position_arr[cashierIndex].area.length-1;
			findPath(num, position_arr[cashierIndex].area[lastAreaIndex].r, position_arr[cashierIndex].area[lastAreaIndex].c, true, action);
		break;
			
		case 'paid':
			$.interior[$.peopleList[num].intID].progressContainer.visible = false;
			playSound('soundCashRegister');
			increaseScore($.peopleList[num].shopData.purchase * gameSetting.profitMultiply[shopData.rate], true);
			nextHumanAction(num, 'leave');			
			sortCashierQueue($.peopleList[num].intID);
		break;
			
		case 'leave':
			var randomPos = Math.floor(Math.random()*entrace_arr.exit.length);
			findPath(num, entrace_arr.exit[randomPos].r, entrace_arr.exit[randomPos].c, true, 'leave');
		break;
			
		case 'stock':
			var stockIndex = $.peopleList[num].stockID;
			if(stockIndex != -1){
				var randomAreaIndex = Math.floor(Math.random()*(position_arr[stockIndex].area.length));

				$.peopleList[num].faceR = position_arr[stockIndex].r;
				$.peopleList[num].faceC = position_arr[stockIndex].c;

				findPath(num, position_arr[stockIndex].area[randomAreaIndex].r, position_arr[stockIndex].area[randomAreaIndex].c, true, action);
			}
		break;
			
		case 'updatestock':
			$.peopleList[num].carryStock = true;
			
			var stallIndex = $.peopleList[num].intID;
			var randomAreaIndex = Math.floor(Math.random()*(position_arr[stallIndex].area.length));
			$.peopleList[num].faceR = position_arr[stallIndex].r;
			$.peopleList[num].faceC = position_arr[stallIndex].c;

			findPath(num, position_arr[stallIndex].area[randomAreaIndex].r, position_arr[stallIndex].area[randomAreaIndex].c, true, 'updatestock');
		break;
			
		case 'backstock':
			var stockIndex = $.peopleList[num].stockID;
			if(stockIndex != -1){
				var randomAreaIndex = Math.floor(Math.random()*(position_arr[stockIndex].area.length));

				$.peopleList[num].faceR = position_arr[stockIndex].r;
				$.peopleList[num].faceC = position_arr[stockIndex].c;

				findPath(num, position_arr[stockIndex].area[randomAreaIndex].r, position_arr[stockIndex].area[randomAreaIndex].c, true, action);
			}
		break;
	}
}

function updateHumanAction(num){
	var targetHuman = $.peopleList[num];

	var targetFace = isometricData.array[targetHuman.faceR][targetHuman.faceC];
	targetHuman.direction = getDirection(targetHuman.x, targetHuman.y, targetFace.x, targetFace.y);
	updateHumanPos(targetHuman);
	
	switch(targetHuman.action){
		case 'enter':
			targetHuman.action = '';
			nextHumanAction(num,'gostall');
		break;
			
		case 'gostall':
			targetHuman.action = '';
			
			if($.interior[targetHuman.intID].totalItem > 0){
				var viewSpeed = randomIntFromInterval(gameSetting.custimerViewTimer[shopData.rate][0], gameSetting.custimerViewTimer[shopData.rate][1]);
				TweenMax.to(targetHuman, viewSpeed, {overwrite:true, onComplete:nextHumanAction, onCompleteParams:[num, 'takeitem']});
			}else{
				nextHumanAction(num, 'takeitem');
			}
		break;
		
		case 'cashier':
			targetHuman.action = '';
			var cashierIndex = findCashierQueueIndex();
			targetHuman.intID = cashierIndex;
			targetHuman.faceR = position_arr[cashierIndex].r;
			targetHuman.faceC = position_arr[cashierIndex].c;
			
			var availableQueue = false;
			for(var n=0;n<$.interior[targetHuman.intID].queueArray.length;n++){
				if($.interior[targetHuman.intID].queueArray[n].index == -1){
					$.interior[targetHuman.intID].queueArray[n].index = num;
					availableQueue = true;
					findPath(num, $.interior[targetHuman.intID].queueArray[n].r, $.interior[targetHuman.intID].queueArray[n].c, true, 'cashiercheckout');
					n = $.interior[targetHuman.intID].queueArray.length;
				}
			}
			
			if(!availableQueue){
				showAngryFace($.peopleList[num]);
				nextHumanAction(num, 'leave');
			}
		break;
			
		case 'cashierqueue':
			targetHuman.action = '';
			var queueIndex = $.interior[targetHuman.intID].queueArray.findIndex(x => x.index === num);
			if(queueIndex == -1){
				var availableQueue = false;
				for(var n=0;n<$.interior[targetHuman.intID].queueArray.length;n++){
					if($.interior[targetHuman.intID].queueArray[n].index == -1){
						if(n == 0){
							$.interior[targetHuman.intID].queueArray[n].index = Number(num);
							targetHuman.action = 'cashiercheckout';
							updateHumanAction(num);
							availableQueue = true;
							n = $.interior[targetHuman.intID].queueArray.length;
						}else{
							$.interior[targetHuman.intID].queueArray[n].index = Number(num);
							findPath(num, $.interior[targetHuman.intID].queueArray[n].r, $.interior[targetHuman.intID].queueArray[n].c, true, 'cashierqueue');
							availableQueue = true;
							n = $.interior[targetHuman.intID].queueArray.length;
						}
					}
				}
				
				if(!availableQueue){
					showAngryFace($.peopleList[num]);
					nextHumanAction(num, 'leave');
				}
			}
		break;
			
		case 'cashiercheckout':
			targetHuman.action = '';
			if($.interior[targetHuman.intID].queueArray[0].index == num){
				var cashierSpeed = randomIntFromInterval(gameSetting.cashierTimer[shopData.rate][0], gameSetting.cashierTimer[shopData.rate][1]);
				TweenMax.to(targetHuman, cashierSpeed, {overwrite:true, onComplete:nextHumanAction, onCompleteParams:[num, 'paid']});
				$.interior[targetHuman.intID].progressCount = 0;
				$.interior[targetHuman.intID].progressContainer.visible = true;
				TweenMax.to($.interior[targetHuman.intID], cashierSpeed, {progressCount:$.interior[targetHuman.intID].progressMax, overwrite:true, ease:Linear.easeNone, onUpdate:drawProgress, onUpdateParams:[$.interior[targetHuman.intID]]});
			}
		break;
		
		case 'leave':
			$.peopleList[num].humanMove.kill();
			$.peopleList[num] = null;
			objectsContainer.removeChild(targetHuman);
		break;
			
		case 'stock':
			nextHumanAction(num, 'updatestock');
			updateRestockQueue($.peopleList[num].intID, false);
			updateStock($.peopleList[num].stockID, true);
		break;
			
		case 'updatestock':
			$.peopleList[num].carryStock = false;
			playSound('soundRestock');
			updateStall($.peopleList[num], false);
			nextHumanAction(num, 'backstock');
		break;
		
		case 'backstock':
			$.interior[$.peopleList[num].stockID].stockActive = false;
			checRestockQueue();
		break;
	}
}

/*!
 * 
 * FIND STALL CASHIER - This is the function that runs to find stall and cashier
 * 
 */
function findStallIndex(num){
	var targetHuman = $.peopleList[num];
	var stallArray = [];
	
	for(var n=0; n<shopData.stall.length; n++){
		var existIndex = targetHuman.shopData.visited.indexOf(shopData.stall[n]);
		if(existIndex == -1 && !$.interior[shopData.stall[n]].lock){
			stallArray.push(shopData.stall[n]);
		}
	}
	
	if(stallArray.length == 0){
		return -1;
	}else{
		shuffle(stallArray);
		return stallArray[0];
	}
}

function findCashierIndex(){	
	var cashierArray = [];
	
	for(var n=0; n<shopData.cashier.length; n++){
		if(!$.interior[shopData.cashier[n]].lock){
			cashierArray.push(shopData.cashier[n]);
		}
	}
	
	if(cashierArray.length == 0){
		return -1;
	}else{
		shuffle(cashierArray);
		return cashierArray[0];
	}
}

function findCashierQueueIndex(){	
	var sortArray = [];
	for(var n=0; n<shopData.cashier.length; n++){
		if(!$.interior[shopData.cashier[n]].lock){
			var currentQueue = 0;
			for(var c=0; c<$.interior[shopData.cashier[n]].queueArray.length; c++){
				if($.interior[shopData.cashier[n]].queueArray[c].index != -1){
					currentQueue++;
				}
			}
		
			sortArray.push({index:shopData.cashier[n], queue:currentQueue});
		}
	}
	
	sortOnObject(sortArray, 'queue', false);
	return sortArray[0].index;
}

/*!
 * 
 * UPDATE STALL AND STOCK - This is the function that runs to update stall and stock
 * 
 */
function updateStall(targetHuman, con){
	if(con){
		targetHuman.shopData.visited.push(targetHuman.intID);
		targetHuman.shopData.maxVisited--;
	}
	
	var id = targetHuman.intID;
	if($.interior[id].totalItem > 0 || !con){
		if(con){
			//customer
			targetHuman.shopData.purchase += position_arr[id].cost;
			$.interior[id].totalItem--;
			$.interior[id].totalItem = $.interior[id].totalItem <= 0 ? 0 : $.interior[id].totalItem;
		}else{
			//restock
			$.interior[id].totalItem = $.interior[id].totalDefaultItem;
		}
		
		updateInteriorFrame(id);
	}
}

function updateStock(id, con){
	if($.interior[id].totalItem > 0 || !con){
		if(con){
			$.interior[id].totalItem--;
			$.interior[id].totalItem = $.interior[id].totalItem <= 0 ? 0 : $.interior[id].totalItem;
		}else{
			$.interior[id].totalItem = $.interior[id].totalDefaultItem;
		}
		
		updateInteriorFrame(id);
	}
}

/*!
 * 
 * UPDATE INTERIOR FRAME - This is the function that runs to update interior frame
 * 
 */
function updateInteriorFrame(id){
	$.interior[id].uncache();
		
	if($.interior[id].totalItem == 0){
		playSound('soundLowstock');
		$.interior[id].icon.visible = true;
		$.interior[id].iconMove.resume();
		$.interior[id].gotoAndStop(0);	
	}else{
		var frameStop = Math.floor($.interior[id].totalItem / position_arr[id].item * ($.interior[id].totalFrames-1))+1;
		frameStop = frameStop >= $.interior[id].totalFrames ? $.interior[id].totalFrames-1 : frameStop;
		$.interior[id].gotoAndStop(Number(frameStop));
	}

	$.interior[id].cache(0,0,$.objects[position_arr[id].id].oriW,$.objects[position_arr[id].id].oriH);

	buildInteriorMask(id);
	sortObjectIndex();
}

function sortCashierQueue(intID){
	for(var n=0;n<$.interior[intID].queueArray.length-1;n++){
		if(n == 0){
			$.interior[intID].queueArray[n].index = -1;
		}
		
		if($.interior[intID].queueArray[n+1].index != -1){
			$.interior[intID].queueArray[n].index = $.interior[intID].queueArray[n+1].index;
			$.interior[intID].queueArray[n+1].index = -1;
			findPath($.interior[intID].queueArray[n].index, $.interior[intID].queueArray[n].r, $.interior[intID].queueArray[n].c, true, 'cashiercheckout');
		}
	}
}

/*!
 * 
 * GET DIRECTION - This is the function that runs to get direction
 * 
 */
function getDirection(fromX, fromY, toX, toY){
    var radiance = 180/Math.PI;
    var walkdirection = -(Math.atan2(toX-fromX, toY-fromY))*radiance;
	walkdirection = Math.floor(walkdirection)+180;
	
	var direct = 'u';
	if(walkdirection >= 270 && walkdirection <= 360){
		//302
		direct = 'u';
	}else if(walkdirection >= 0 && walkdirection <= 79){
		//56
		direct = 'r';
	}else if(walkdirection >= 80 && walkdirection <= 200){
		//117
		direct = 'd';
	}else if(walkdirection >= 180 && walkdirection <= 269){
		//242
		direct = 'l';
	}
	return direct;
}

/*!
 * 
 * FIND PATH - This is the function that runs to find path
 * 
 */
function findPath(num, r, c, con, action){
	var allPath_arr = [];
	var arrayNearest_arr = [{c:0, r:-1},
							{c:-1, r:0},{c:1, r:0},
							{c:0, r:1}];
	
	arrayNearest_arr.unshift({c:0, r:0});
	for(var n=0; n<arrayNearest_arr.length; n++){
		allPath_arr.push(arrayNearest_arr[n]);	
	}
	
	//widest
	var arrayWidest_arr = [{c:-1, r:-1},{c:1, r:-1},
						{c:-1, r:1},{c:1, r:1}];
	for(var n=0; n<arrayWidest_arr.length; n++){
		allPath_arr.push(arrayWidest_arr[n]);	
	}
	
	var targetHuman = $.peopleList[num];
	targetHuman.action = action;
	
	if(findExistPath(num,r,c,allPath_arr) && !con){
		updateHumanAction(num);
	}else{
		var phaseExact = false;
		var phaseNearest = false;
		var getNearest_arr = [];
		
		if(con){
			phaseExact = true;
			var column = Number(c) + Number(arrayNearest_arr[0].c);
			var row = Number(r) + Number(arrayNearest_arr[0].r);
			
			if(targetHuman.r == row && targetHuman.c == column){
				updateHumanAction(num);
			}else{
				generatePath(num, row, column);
			}	
		}else {
			if(!phaseExact){
				for(var n=0; n<arrayNearest_arr.length; n++){
					var column = Number(c) + Number(arrayNearest_arr[n].c);
					var row = Number(r) + Number(arrayNearest_arr[n].r);	
					if(column >= 0 && column <= isometricData.column && row >= 0 && row <= isometricData.row){
						var targetISO = isometricData.array[row][column];
						if(typeof isometricData.array[row][column] != 'undefined'){
							if(targetISO.walkable){
								getNearest_arr.push({r:row, c:column, distance:getDistance(targetHuman.x, targetHuman.y, targetISO.x, targetISO.y)});
							}
						}
					}
				}
				
				sortOnObject(getNearest_arr, 'distance', false);
				
				for(var n=0; n<getNearest_arr.length; n++){
					phaseNearest = true;
					if(targetHuman.r == getNearest_arr[n].r && targetHuman.c == getNearest_arr[n].c){
						updateHumanAction(num);
					}else{
						generatePath(num, getNearest_arr[n].r, getNearest_arr[n].c);
					}	
					n = getNearest_arr.length;
				}
			}
			
			if(!phaseNearest){
				getNearest_arr = [];
				for(var n=0; n<arrayWidest_arr.length; n++){
					var column = Number(c) + Number(arrayWidest_arr[n].c);
					var row = Number(r) + Number(arrayWidest_arr[n].r);	
					if(column >= 0 && column <= isometricData.column && row >= 0 && row <= isometricData.row){
						var targetISO = isometricData.array[row][column];
						if(typeof isometricData.array[row][column] != 'undefined'){
							if(targetISO.walkable){
								getNearest_arr.push({r:row, c:column, distance:getDistance(targetHuman.x, targetHuman.y, targetISO.x, targetISO.y)});
							}
						}
					}
				}
				
				sortOnObject(getNearest_arr, 'distance', false);
				
				for(var n=0; n<getNearest_arr.length; n++){
					if(targetHuman.r == getNearest_arr[n].r && targetHuman.c == getNearest_arr[n].c){
						updateHumanAction(num);
					}else{
						generatePath(num, getNearest_arr[n].r, getNearest_arr[n].c);
					}	
					n = getNearest_arr.length;
				}
			}
		}
	}
}

function findExistPath(num, r, c, array){
	for(var n=0; n<array.length; n++){
		var column = Number(c) + Number(array[n].c);
		var row = Number(r) + Number(array[n].r);
		var targetHuman = $.peopleList[num];
		if(targetHuman.r == row && targetHuman.c == column){
			return true;
		}
	}
	
	return false;
}

/*!
 * 
 * SORT OBJECT INDEX - This is the function that runs to soft object index
 * 
 */
function sortObjectIndex(){
	gameData.index_arr = [];
	
	for(var i=0; i<objectsContainer.numChildren; i++) {
		var targetObj = objectsContainer.getChildAt(i);
		gameData.index_arr.push({obj:targetObj, depth:Math.floor((targetObj.y-1)*canvasW+targetObj.x)});
    }
	sortOnObject(gameData.index_arr, 'depth', false);
	
	var indexNum = 0;
	for(var n=0;n<gameData.index_arr.length;n++){
		objectsContainer.setChildIndex(gameData.index_arr[n].obj, indexNum);
		indexNum++;
	}
}

/*!
 * 
 * GAME STATS - This is the function that runs to update game stats
 * 
 */
function updateScore(){
	var currentScore = addCommas(Math.floor(tweenData.score));
	if(currentScore.length > 5){
		currentScore = currentScore.substring(0,currentScore.length-4)+'K';
	}
	
	scoreTxt.text = gameSetting.currency + currentScore;
	checkStallPurchase()
}

function increaseScore(score, con){
	if(con){
		playerData.score += score;
	}else{
		playerData.score -= score;	
	}
	
	saveLevelData();
	TweenMax.to(tweenData, 1, {score:playerData.score, overwrite:true, onUpdate:updateScore});
}

function updateRating(){
	var totalObjects = shopData.stall.length;
	totalObjects += shopData.cashier.length;
	totalObjects += shopData.stock.length;
	
	var rateCount = Math.floor(totalObjects / 5);	
	var rateReady = shopData.stallReady;
	rateReady += shopData.stockReady;
	rateReady += shopData.cashierReady;
	
	rateReady = rateReady < rateCount ? rateCount : rateReady;
	
	for(var n=0; n<5; n++){
		$.stars[n].visible = false;
		$.stars['result'+n].visible = false;
		
		if(rateReady >= (rateCount*(n+1))){
		   	$.stars[n].visible = true;
			$.stars['result'+n].visible = true;
		    shopData.rate = n;
		}
	}
}

/*!
 * 
 * OPTIONS - This is the function that runs to toggle options
 * 
 */

function toggleOption(){
	if(optionsContainer.visible){
		optionsContainer.visible = false;
	}else{
		optionsContainer.visible = true;
	}
}


/*!
 * 
 * OPTIONS - This is the function that runs to mute and fullscreen
 * 
 */
function toggleSoundMute(con){
	buttonSoundOff.visible = false;
	buttonSoundOn.visible = false;
	toggleSoundInMute(con);
	if(con){
		buttonSoundOn.visible = true;
	}else{
		buttonSoundOff.visible = true;	
	}
}

function toggleMusicMute(con){
	buttonMusicOff.visible = false;
	buttonMusicOn.visible = false;
	toggleMusicInMute(con);
	if(con){
		buttonMusicOn.visible = true;
	}else{
		buttonMusicOff.visible = true;	
	}
}

function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

/*!
 * 
 * SHARE - This is the function that runs to open share url
 * 
 */
function share(action){
	gtag('event','click',{'event_category':'share','event_label':action});
	
	var loc = location.href
	loc = loc.substring(0, loc.lastIndexOf("/") + 1);
	
	var title = '';
	var text = '';
	
	title = shareTitle.replace("[SCORE]", addCommas(playerData.score));
	title = title.replace("[STAR]", shopData.rate+1);
	
	text = shareMessage.replace("[SCORE]", addCommas(playerData.score));
	text = text.replace("[STAR]", shopData.rate+1);
	var shareurl = '';
	
	if( action == 'twitter' ) {
		shareurl = 'https://twitter.com/intent/tweet?url='+loc+'&text='+text;
	}else if( action == 'facebook' ){
		shareurl = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(loc+'share.php?desc='+text+'&title='+title+'&url='+loc+'&thumb='+loc+'share.jpg&width=590&height=300');
	}else if( action == 'google' ){
		shareurl = 'https://plus.google.com/share?url='+loc;
	}else if( action == 'whatsapp' ){
		shareurl = "whatsapp://send?text=" + encodeURIComponent(text) + " - " + encodeURIComponent(loc);
	}
	
	window.open(shareurl);
}