import React from 'react'
import { Flex, Space, Table, Tag } from 'antd';
import Header from './Header';


const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: (_, { tags }) => (
      <Flex gap="small" align="center" wrap>
        {tags.map(tag => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </Flex>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

const Userlogs = () => {
  return (
    <div>

      {/* <Table columns={columns} dataSource={data} /> */}

      <Header />

      <div class="w-full p-4 mx-auto mt-4">

        <div class="w-full flex justify-between items-center mb-3 mt-1">

          <div class="">
            <div class="w-full max-w-sm min-w-[200px] relative">
              <div class="relative">
                <input
                  class="bg-white w-full pr-11 h-10 pl-3 py-2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded transition duration-200 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                  placeholder="Search for invoice..."
                />
                <button
                  class="absolute h-8 w-8 right-1 top-1 my-auto px-2 flex items-center bg-white rounded "
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-8 h-8 text-slate-600">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
          <table class="w-full text-left table-auto min-w-max">
            <thead>
              <tr>
                <th class="p-4 border-b border-slate-200 bg-slate-50">
                  <p class="text-sm font-normal leading-none text-slate-500">
                    Invoice Number
                  </p>
                </th>
                <th class="p-4 border-b border-slate-200 bg-slate-50">
                  <p class="text-sm font-normal leading-none text-slate-500">
                    Customer
                  </p>
                </th>
                <th class="p-4 border-b border-slate-200 bg-slate-50">
                  <p class="text-sm font-normal leading-none text-slate-500">
                    Amount
                  </p>
                </th>
                <th class="p-4 border-b border-slate-200 bg-slate-50">
                  <p class="text-sm font-normal leading-none text-slate-500">
                    Issued
                  </p>
                </th>
                <th class="p-4 border-b border-slate-200 bg-slate-50">
                  <p class="text-sm font-normal leading-none text-slate-500">
                    Due Date
                  </p>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-slate-50 border-b border-slate-200">
                <td class="p-4 py-5">
                  <p class="block font-semibold text-sm text-slate-800">PROJ1001</p>
                </td>
                <td class="p-4 py-5">
                  <p class="text-sm text-slate-500">John Doe</p>
                </td>
                <td class="p-4 py-5">
                  <p class="text-sm text-slate-500">$1,200.00</p>
                </td>
                <td class="p-4 py-5">
                  <p class="text-sm text-slate-500">2024-08-01</p>
                </td>
                <td class="p-4 py-5">
                  <p class="text-sm text-slate-500">2024-08-15</p>
                </td>
              </tr>
              <tr class="hover:bg-slate-50 border-b border-slate-200">
                <td class="p-4 py-5">
                  <p class="block font-semibold text-sm text-slate-800">PROJ1002</p>
                </td>
                <td class="p-4 py-5">
                  <p class="text-sm text-slate-500">Jane Smith</p>
                </td>
                <td class="p-4 py-5">
                  <p class="text-sm text-slate-500">$850.00</p>
                </td>
                <td class="p-4 py-5">
                  <p class="text-sm text-slate-500">2024-08-05</p>
                </td>
                <td class="p-4 py-5">
                  <p class="text-sm text-slate-500">2024-08-20</p>
                </td>
              </tr>
              <tr class="hover:bg-slate-50 border-b border-slate-200">
                <td class="p-4 py-5">
                  <p class="block font-semibold text-sm text-slate-800">PROJ1003</p>
                </td>
                <td class="p-4 py-5">
                  <p class="text-sm text-slate-500">Acme Corp</p>
                </td>
                <td class="p-4 py-5">
                  <p class="text-sm text-slate-500">$2,500.00</p>
                </td>
                <td class="p-4 py-5">
                  <p class="text-sm text-slate-500">2024-08-07</p>
                </td>
                <td class="p-4 py-5">
                  <p class="text-sm text-slate-500">2024-08-21</p>
                </td>
              </tr>
              <tr class="hover:bg-slate-50 border-b border-slate-200">
                <td class="p-4 py-5">
                  <p class="block font-semibold text-sm text-slate-800">PROJ1004</p>
                </td>
                <td class="p-4 py-5">
                  <p class="text-sm text-slate-500">Global Inc</p>
                </td>
                <td class="p-4 py-5">
                  <p class="text-sm text-slate-500">$4,750.00</p>
                </td>
                <td class="p-4 py-5">
                  <p class="text-sm text-slate-500">2024-08-10</p>
                </td>
                <td class="p-4 py-5">
                  <p class="text-sm text-slate-500">2024-08-25</p>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="flex justify-between items-center px-4 py-3">
            <div class="text-sm text-slate-500">
              Showing <b>1-5</b> of 45
            </div>
            <div class="flex space-x-1">
              <button class="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
                Prev
              </button>
              <button class="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-white bg-slate-800 border border-slate-800 rounded hover:bg-slate-600 hover:border-slate-600 transition duration-200 ease">
                1
              </button>
              <button class="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
                2
              </button>
              <button class="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
                3
              </button>
              <button class="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
                Next
              </button>
            </div>
          </div>
        </div>






      </div>

    </div>
  )
}

export default Userlogs
