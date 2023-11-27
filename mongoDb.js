

assignment> show dbs
admin         40.00 KiB
aggregation  200.00 KiB
assignment   152.00 KiB
config       108.00 KiB
local         40.00 KiB
mongo         12.00 KiB
mongoDb      180.00 KiB
shop         716.00 KiB
students      72.00 KiB
assignment> show collections
customers
orders
products
assignment> db.customers.find()
[
  {
    _id: ObjectId("6555b715e906f17c0a2c9e7b"),
    id: 1,
    customerName: 'john doe',
    city: 'new york'
  },
  {
    _id: ObjectId("6555b715e906f17c0a2c9e7c"),
    id: 2,
    customerName: 'jane smith',
    city: 'london'
  },
  {
    _id: ObjectId("6555b715e906f17c0a2c9e7d"),
    id: 3,
    customerName: 'david wang',
    city: 'beljing'
  },
  {
    _id: ObjectId("6555b715e906f17c0a2c9e7e"),
    id: 4,
    customerName: 'lisa chen',
    city: 'shanghai'
  }
]
assignment> db.orders.find()
[
  {
    _id: ObjectId("6555b84be906f17c0a2c9e7f"),
    orderId: 1001,
    customerId: 1,
    total: 200
  },
  {
    _id: ObjectId("6555b84be906f17c0a2c9e80"),
    orderId: 1002,
    customerId: 2,
    total: 150
  },
  {
    _id: ObjectId("6555b9c2e906f17c0a2c9e83"),
    orderId: 1003,
    customerId: 3,
    total: 300
  },
  {
    _id: ObjectId("6555b9c2e906f17c0a2c9e84"),
    orderId: 1004,
    customerId: 1,
    total: 120
  }
]
assignment> db.products.find()
[
  {
    _id: ObjectId("6555bb13e906f17c0a2c9e85"),
    productId: 1,
    productName: 'laptop',
    price: 1000
  },
  {
    _id: ObjectId("6555bb13e906f17c0a2c9e86"),
    productId: 2,
    productName: 'smartphone',
    price: 800
  },
  {
    _id: ObjectId("6555bb13e906f17c0a2c9e87"),
    productId: 3,
    productName: 'tablet',
    price: 500
  },
  {
    _id: ObjectId("6555bb13e906f17c0a2c9e88"),
    productId: 4,
    productName: 'tv',
    price: 1500
  }
]
assignment>





1.Retrieve the names of all customers.

assignment> db.customers.find({},{ _id: 0, customerName: 1 });
[
  { customerName: 'john doe' },
  { customerName: 'jane smith' },
  { customerName: 'david wang' },
  { customerName: 'lisa chen' }
]
assignment>


find 1 parametr {} define no filter methord is included id indefault included so we exclude that feild put 0 to that


AGGREGATE METHORD
assignment> db.customers.aggregate([{$project: {_id:0,customerName:1} }])
[
  { customerName: 'john doe' },
  { customerName: 'jane smith' },
  { customerName: 'david wang' },
  { customerName: 'lisa chen' }
]
assignment>
project is a stage represent filter



2. Retrieve the total number of orders placed.
assignment> db.orders.find().count()        =4

AGGREGATION 
assignment> db.orders.aggregate([{$group: {_id:null,result:{$sum:1}} }]        
_id=null mean all documents grouped to single.without any specific condition
$sum used to calculate sum of each documents add with 1 and stores the final count in result field


3.Retrieve the details of the order with OrderID 1003.
assignment> db.orders.aggregate([{$match: {orderId:1003}}])
[
  {
    _id: ObjectId("6555b9c2e906f17c0a2c9e83"),
    orderId: 1003,
    customerId: 3,
    total: 300
  }
]


4.Retrieve the names of customers who are from Beijing.

assignment> db.customers.aggregate([{$match : {city:'beljing'} },{$project: {_id:0,customerName:1}} ])

[ { customerName: 'david wang' } ]
assignment>


5.Retrieve the total price of all orders.
assignment> db.orders.aggregate([{$group : {_id:null,total: {$sum : '$total'}} }])
[ { _id: null, total: 770 } ]
assignment>


6.Retrieve the product names and their prices.

assignment> db.products.aggregate([{$project: {_id:0,productName:1,price:1} }])
[
  { productName: 'laptop', price: 1000 },
  { productName: 'smartphone', price: 800 },
  { productName: 'tablet', price: 500 },
  { productName: 'tv', price: 1500 }
]

7.Retrieve the names of customers along with their city.
assignment> db.customers.aggregate([{$project: {_id:0,customerName:1,city:1} }])
[
  { customerName: 'john doe', city: 'new york' },
  { customerName: 'jane smith', city: 'london' },
  { customerName: 'david wang', city: 'beljing' },
  { customerName: 'lisa chen', city: 'shanghai' }
]

8.Retrieve the orders placed by John Doe (CustomerID 1).
assignment> db.orders.aggregate([{$match : {customerId:1} }])
[
  {
    _id: ObjectId("6555b84be906f17c0a2c9e7f"),
    orderId: 1001,
    customerId: 1,
    total: 200
  },
  {
    _id: ObjectId("6555b9c2e906f17c0a2c9e84"),
    orderId: 1004,
    customerId: 1,
    total: 120
  }
]
assignment>



9.Retrieve the customers who have placed orders.

db.getCollection('orders').aggregate(
  [
    {
      $lookup: {
        from: 'customers',
        localField: 'customerId',
        foreignField: 'id',
        as: 'result'
      }
    },
    {
      $project: {
        _id: 0,
        'result.customerName': 1
      }
    }
  ],
  { maxTimeMS: 60000, allowDiskUse: true }
);



ANSWER
{
  result: [
    {
      customerName: 'john doe'
    }
  ]
}
{
  result: [
    {
      customerName: 'jane smith'
    }
  ]
}
{
  result: [
    {
      customerName: 'david wang'
    }
  ]
}
{
  result: [
    {
      customerName: 'john doe'
    }
  ]
}







10.Retrieve the orders placed by customers f.
db.getCollection('orders').aggregate(
  [
    {
      $lookup: {
        from: 'customers',
        localField: 'customerId',
        foreignField: 'id',
        as: 'result'
      }
    },
    { $match: { 'result.city': 'shangai' } }
  ],
  { maxTimeMS: 60000, allowDiskUse: true }
);

ANSWER
{
  _id: ObjectId("6555b84be906f17c0a2c9e80"),
  orderId: 1002,
  customerId: 2,
  total: 150,
  result: [
    {
      _id: ObjectId("6555b715e906f17c0a2c9e7c"),
      id: 2,
      customerName: 'jane smith',
      city: 'london'
    }
  ]
}



11.Retrieve the highest price from the Products table.
db.products.aggregate([
  {
    $group: {
      _id: null,
      output: { $max: '$price' }
    }
  }
]);

ANSWER
{
  _id: null,
  output: 1500
}


12.Retrieve the average price of all products.
db.products.aggregate([{$group :
{
_id:null,
average: {$avg:'$price'}
}
}])

ANSWER	
  _id: null,
  average: 950



13.Retrieve the details of customers who have placed orders.
db.getCollection('orders').aggregate(
  [
    {
      $lookup: {
        from: 'customers',
        localField: 'customerId',
        foreignField: 'id',
        as: 'result'
      }
    },
    {
      $project: {
        _id: 0,
        'result.customerName': 1,
        'result.city': 1
      }
    }
  ],
  { maxTimeMS: 60000, allowDiskUse: true }
);

ANSWER
{
  result: [
    {
      customerName: 'david wang',
      city: 'beljing'
    }
  ]
  result: [
    {
      customerName: 'jane smith',
      city: 'london'
    }
  ]
{
  result: [
    {
      customerName: 'david wang',
      city: 'beljing'
    }
  ]

  result: [
    {
      customerName: 'lisa chen',
      city: 'shanghai'
    }
  ]
}


ANOTHER NETHORD
db.orders.aggregate([{$lookup: 
{
from:'customers',
localField:'customerId',
 foreignField: 'id',
       as: 'result'
}
},
                     {$unwind:{path:'$result'} },
                     {$replaceRoot: {newRoot:'$result'} },

                     {
$project:{

 cutomerName:1
}
}


])




14.Retrieve the names of customers who have not placed any orders.
db.getCollection('customers').aggregate(
  [
    {
      $lookup: {
        from: 'orders',
        localField: 'id',
        foreignField: 'customerId',
        as: 'result'
      }
    },
    { $match: { result: { $size: 0 } } },
    { $project: { x: '$customerName' } }
  ],
  { maxTimeMS: 60000, allowDiskUse: true }
);

ANSWER THERE IS NO OUTPUT



15.Retrieve the customer names along with the total order value.
db.getCollection('customers').aggregate(
db.getCollection('customers').aggregate(
  [
    {
      $lookup: {
        from: 'orders',
        localField: 'id',
        foreignField: 'customerId',
        as: 'result'
      }
    },
    {
      $unwind: {
        path: '$result',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: '$customerName',
        totalOrderValue: { $sum: '$result.total' }
      }
    },
    {
      $project: {
        _id: 0,
        customerNaam: '$_id',
        toatlOrderPrice: '$totalOrderValue'
      }
    }
  ],
  { maxTimeMS: 60000, allowDiskUse: true }
);



16.Retrieve the orders placed in descending order of their total value.
db.getCollection('orders').aggregate(
  [{ $sort: { total: 1 } }]
 
);

ANSWERS
assignment> db.orders.aggregate(
... [{
... $sort : {total:1}
... }])
[
  {
    _id: ObjectId("6555b9c2e906f17c0a2c9e84"),
    orderId: 1004,
    customerId: 4,
    total: 120
  },
  {
    _id: ObjectId("6555b84be906f17c0a2c9e80"),
    orderId: 1002,
    customerId: 2,
    total: 150
  },
  {
    _id: ObjectId("6555b84be906f17c0a2c9e7f"),
    orderId: 1001,
    customerId: 1,
    total: 200
  },
  {
    _id: ObjectId("6555b9c2e906f17c0a2c9e83"),
    orderId: 1003,
    customerId: 3,
    total: 300
  }
]	


17.Retrieve the product names along with their prices, sorted by price in descending order.
assignment> db.products.aggregate([{
... $sort: {price:-1}
... },
... {$project:{
... _id:0,
... productName:1,
... price:1}
... }
... ])
[


18.Retrieve the names of customers along with the number of orders they have placed.
db.getCollection('customers').aggregate(
  [
    {
      $lookup: {
        from: 'orders',
        localField: 'id',
        foreignField: 'customerId',
        as: 'result'
      }
    },
    {
      $project: {
        _id: 0,
        customerName: 1,
        noOfOrders: { $size: '$result' }
      }
    }
  ]
  
);

ANSWER 
[
  { customerName: 'john doe', numberOfOrders: 1 },
  { customerName: 'jane smith', numberOfOrders: 1 },
  { customerName: 'david wang', numberOfOrders: 1 },
  { customerName: 'lisa chen', numberOfOrders: 1 }
]


ANOTHER METHORD
db.getCollection('customers').aggregate(
  [
    {
      $lookup: {
        from: 'orders',
        localField: 'id',
        foreignField: 'customerId',
        as: 'result'
      }
    },
    {
      $unwind: {
        path: '$result',
        includeArrayIndex: 'arrayIndex',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        _id: 0,
        customerName: 1,
        totalOrders: { $add: ['$arrayIndex', 1] } ARRAY INDEX GET OBJECTS BUT ITS HOW INDEX               						SO ALWAYS ADD 1 TO INDEX TO GET L3NGTH
      }
    }
  ]
);

19.Retrieve the orders placed by customers from London.
assignment> db.customers.aggregate([
... {
...  $lookup:{
...           from:'orders',
...           localField:'id',
...           foreignField:'customerId',
...           as:'result'
...          }
... }
... ,
... {
...  $match : {
...            city:'london'
...           }
... },
... {
... $project: {
...            _id:0,
...            order:'$result.orderId',
...            city:1
...           }
... }
... ])

ANSWER 

[ { city: 'london', order: [ 1002 ] } ]



20.nsert a new customer with ID 5, name 'Emma Wilson', and city 'Paris'.

assignment> db.customers.insertOne({
... id:5,
... customerName:'emma wilson',
... city:'paris'
... })
{
  acknowledged: true,
  insertedId: ObjectId("6558648d815939bab0732f77")
}

HOQW TO DELETE THIS 
assignment> db.customers.deleteOne({id:5})
{ acknowledged: true, deletedCount: 1 }





21.Update the city of the customer with ID 3 to 'Tokyo'.

assignment> db.customers.updateOne({
... id:3},
... {$set :{city:'tokyo'}
... }
... )
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}

22.Update the price of the product with ID 2 to 900.
assignment> db.products.updateOne(
... {productId:2},
... {$set : {price:900}
... })
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}


23.Delete the order with OrderID 1002.
assignment> db.orders.deleteOne({orderId:2})

{ acknowledged: true, deletedCount: 0 }
assignment>




24.Retrieve the names of customers and their cities using aliases.
assignment> db.customers.aggregate([
... {$project: {
...             _id:0,
...             customerNameAlias:'$customerName',
...              cityAlias:'$city'
...             }
... }
... ])

ANSWERS
[
  { customerNameAlias: 'john doe', cityAlias: 'new york' },
  { customerNameAlias: 'jane smith', cityAlias: 'london' },
  { customerNameAlias: 'david wang', cityAlias: 'tokyo' },
  { customerNameAlias: 'lisa chen', cityAlias: 'shanghai' }
]







Q.HOW TO DELETE OR SPECIFIC FIED FROM DOCUMENT
assignment> db.customers.updateOne(
... {id:1},
... {$unset:{
...          temp:1,
...          newCustomer:1
...          }
... })
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
assignment>
NOW THE TEMP AND NEWCUSTOMER FIELD FROM THAT DOCUMENT WILL REMOVED


  FOR UPDATE MANY TO REMOVE FROM ALL 
assignment> db.customers.updateMany( 
{}, IF NOT GIVE FILTER LIKE EMPTY IT WILL APPLY FOPR ALL
{ $unset: { temp: 1, newCustomer: 1 } } )
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 4,
  modifiedCount: 3,
  upsertedCount: 0
}
assignment>




25.Retrieve the customer names along with their total order value, sorted by order value in descending order.

db.getCollection('customers').aggregate(
  [
    {
      $lookup: {
        from: 'orders',
        localField: 'id',
        foreignField: 'customerId',
        as: 'result'
      }
    },
    {
      $unwind: {
        path: '$result',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: '$id',
        customerName: { $first: '$customerName' },
        totalOrder: { $sum: '$result.total' }
      }
    },
    { $sort: { totalOrder: -1 } },
    {
      $project: {
        _id: 0,
        customerName: 1,
        totalOrder: 1
      }
    }
  ],
  { maxTimeMS: 60000, allowDiskUse: true }
);





26.Retrieve the customer names along with the number of orders they have placed, sorted by the number of orders in ascending order.
db.getCollection('customers').aggregate(
 

 [
    {
      $lookup: {
        from: 'orders',
        localField: 'id',
        foreignField: 'customerId',
        as: 'result'
      }
    },
    {
      $unwind: {
        path: '$result',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: '$customerName',
        NoOfOrders: { $sum: 1 } //count the no of documents in each group
      }
    },
    { $sort: { NoOfOrders: 1 } }
  ],
  { maxTimeMS: 60000, allowDiskUse: true }
);




27.Retrieve the customer names along with the average order value, sorted by the average order value in descending order.
assignment> db.customers.aggregate([
... {$lookup: {
...            from:'orders',
...            localField:'id',
...            foreignField:'customerId'
...            ,as:'result'
...            }
... },
... {$unwind: { path:'$result',
...             preserveNullAndEmptyArrays:true
...           }
... },
... {$group: {
...           _id:'$custommerName',
...           orderValue: {$avg:'$result.total'}
...           }
... },
... {$sort: {orderValue:-1}
... }
... ])






28.Calculate the total price of all orders placed by customers from london.
db.getCollection('customers').aggregate(
  [
    { $match: { city: 'london' } },
    {
      $lookup: {
        from: 'products',
        localField: 'id',
        foreignField: 'productId',
        as: 'result'
      }
    },
    {
      $unwind: {
        path: '$result',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: { _id: 0, total: '$result.price' }
    }
  ],
  { maxTimeMS: 60000, allowDiskUse: true }
);


ANSWER
 {
  total: 900
}


29.Calculate the average price of products in the Tablet category.

db.getCollection('products').aggregate(
  [
    { $match: { productName: 'tablet' } },
    {
      $group: {
        _id: null,
        averagePrice: { $avg: '$price' }
      }
    }
  ],
  { maxTimeMS: 60000, allowDiskUse: true }
);




30.Calculate the total revenue generated by each customer.
assignment> db.customers.aggregate([ 
{ $lookup: 
         { from: 'orders',
           localField: 'id',
           foreignField: 'customerId', 
           as: 'result'
          }
 },
 { $unwind: '$result' },
 { $group: 
         { _id: '$customerName',
            totalRevenue: {$sum:'$result.total' }
          }
},
{$project:
      {_id:0,
       customerName:'$_id',
       totalRevenue:1
       }
 }
])



answer

{
  totalRevenue: 200,
  customerName: 'john doe'
}
{
  totalRevenue: 150,
  customerName: 'jane smith'
}
{
  totalRevenue: 300,
  customerName: 'david wang'
}
{
  totalRevenue: 120,
  customerName: 'lisa chen'
}
