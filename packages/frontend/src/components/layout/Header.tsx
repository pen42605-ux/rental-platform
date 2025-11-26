'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  PlusCircleIcon,
  HeartIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import { HomeIcon } from '@heroicons/react/24/solid';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-secondary-100">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-xl transition-shadow">
              <HomeIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-display font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
              好房網
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4 overflow-x-auto flex-1 mx-6">
            <Link
              href="/?type=新建案"
              className="text-secondary-600 hover:text-primary-500 font-medium transition-colors whitespace-nowrap text-sm"
            >
              新建案
            </Link>
            <Link
              href="/?type=中古屋"
              className="text-secondary-600 hover:text-primary-500 font-medium transition-colors whitespace-nowrap text-sm"
            >
              中古屋
            </Link>
            <Link
              href="/?type=租屋"
              className="text-secondary-600 hover:text-primary-500 font-medium transition-colors whitespace-nowrap text-sm"
            >
              租屋
            </Link>
            <Link
              href="/?type=土地"
              className="text-secondary-600 hover:text-primary-500 font-medium transition-colors whitespace-nowrap text-sm"
            >
              土地
            </Link>
            <Link
              href="/?type=店面"
              className="text-secondary-600 hover:text-primary-500 font-medium transition-colors whitespace-nowrap text-sm"
            >
              店面
            </Link>
            <Link
              href="/?type=辦公"
              className="text-secondary-600 hover:text-primary-500 font-medium transition-colors whitespace-nowrap text-sm"
            >
              辦公
            </Link>
            <Link
              href="/?type=廠房"
              className="text-secondary-600 hover:text-primary-500 font-medium transition-colors whitespace-nowrap text-sm"
            >
              廠房
            </Link>
            <Link
              href="/?type=社區"
              className="text-secondary-600 hover:text-primary-500 font-medium transition-colors whitespace-nowrap text-sm"
            >
              社區
            </Link>
            <Link
              href="/"
              className="text-secondary-600 hover:text-primary-500 font-medium transition-colors whitespace-nowrap text-sm"
            >
              找房
            </Link>
            <Link
              href="/interior-design"
              className="text-secondary-600 hover:text-primary-500 font-medium transition-colors whitespace-nowrap text-sm"
            >
              室內設計
            </Link>
            <Link
              href="/news"
              className="text-secondary-600 hover:text-primary-500 font-medium transition-colors whitespace-nowrap text-sm"
            >
              新聞
            </Link>
            <Link
              href="/pricing"
              className="text-primary-600 hover:text-primary-700 font-semibold transition-colors whitespace-nowrap text-sm"
            >
              收費標準
            </Link>
          </div>

          {/* Desktop Secondary Navigation */}
          <div className="hidden md:flex lg:hidden items-center gap-4">
            <Menu as="div" className="relative">
              <Menu.Button className="text-secondary-600 hover:text-primary-500 font-medium transition-colors">
                分類
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-secondary-100 py-2 focus:outline-none z-50">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/?type=新建案"
                        className={`${
                          active ? 'bg-secondary-50' : ''
                        } block px-4 py-2 text-secondary-700 text-sm`}
                      >
                        新建案
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/?type=中古屋"
                        className={`${
                          active ? 'bg-secondary-50' : ''
                        } block px-4 py-2 text-secondary-700 text-sm`}
                      >
                        中古屋
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/?type=租屋"
                        className={`${
                          active ? 'bg-secondary-50' : ''
                        } block px-4 py-2 text-secondary-700 text-sm`}
                      >
                        租屋
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/?type=土地"
                        className={`${
                          active ? 'bg-secondary-50' : ''
                        } block px-4 py-2 text-secondary-700 text-sm`}
                      >
                        土地
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/?type=店面"
                        className={`${
                          active ? 'bg-secondary-50' : ''
                        } block px-4 py-2 text-secondary-700 text-sm`}
                      >
                        店面
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/?type=辦公"
                        className={`${
                          active ? 'bg-secondary-50' : ''
                        } block px-4 py-2 text-secondary-700 text-sm`}
                      >
                        辦公
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/?type=廠房"
                        className={`${
                          active ? 'bg-secondary-50' : ''
                        } block px-4 py-2 text-secondary-700 text-sm`}
                      >
                        廠房
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/?type=社區"
                        className={`${
                          active ? 'bg-secondary-50' : ''
                        } block px-4 py-2 text-secondary-700 text-sm`}
                      >
                        社區
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/"
                        className={`${
                          active ? 'bg-secondary-50' : ''
                        } block px-4 py-2 text-secondary-700 text-sm`}
                      >
                        找房
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/interior-design"
                        className={`${
                          active ? 'bg-secondary-50' : ''
                        } block px-4 py-2 text-secondary-700 text-sm`}
                      >
                        室內設計
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/news"
                        className={`${
                          active ? 'bg-secondary-50' : ''
                        } block px-4 py-2 text-secondary-700 text-sm`}
                      >
                        新聞
                      </Link>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link href="/create" className="btn-primary">
                  <PlusCircleIcon className="w-5 h-5 mr-1.5" />
                  發布房源
                </Link>
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-secondary-50 transition-colors">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold text-sm">
                        {user?.name?.charAt(0)}
                      </span>
                    </div>
                    <span className="text-secondary-700 font-medium">{user?.name}</span>
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-secondary-100 py-1 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/my-listings"
                            className={`${
                              active ? 'bg-secondary-50' : ''
                            } flex items-center gap-2 px-4 py-2 text-secondary-700`}
                          >
                            <HomeIcon className="w-5 h-5" />
                            我的房源
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/favorites"
                            className={`${
                              active ? 'bg-secondary-50' : ''
                            } flex items-center gap-2 px-4 py-2 text-secondary-700`}
                          >
                            <HeartIcon className="w-5 h-5" />
                            收藏清單
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/orders"
                            className={`${
                              active ? 'bg-secondary-50' : ''
                            } flex items-center gap-2 px-4 py-2 text-secondary-700`}
                          >
                            <BanknotesIcon className="w-5 h-5" />
                            我的訂單
                          </Link>
                        )}
                      </Menu.Item>
                      {user?.role === 'ADMIN' && (
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/admin"
                              className={`${
                                active ? 'bg-secondary-50' : ''
                              } flex items-center gap-2 px-4 py-2 text-purple-600 font-medium`}
                            >
                              <Cog6ToothIcon className="w-5 h-5" />
                              管理後台
                            </Link>
                          )}
                        </Menu.Item>
                      )}
                      <hr className="my-1 border-secondary-100" />
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={logout}
                            className={`${
                              active ? 'bg-secondary-50' : ''
                            } flex items-center gap-2 px-4 py-2 text-secondary-700 w-full`}
                          >
                            <ArrowRightOnRectangleIcon className="w-5 h-5" />
                            登出
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-ghost">
                  登入
                </Link>
                <Link href="/register/role" className="btn-primary">
                  免費註冊
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary-50"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-secondary-100 max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col gap-2">
              <div className="px-4 py-2 text-secondary-500 text-xs font-semibold uppercase tracking-wider">
                房源分類
              </div>
              <Link
                href="/?type=新建案"
                className="px-4 py-2 text-secondary-700 hover:bg-secondary-50 rounded-lg"
              >
                新建案
              </Link>
              <Link
                href="/?type=中古屋"
                className="px-4 py-2 text-secondary-700 hover:bg-secondary-50 rounded-lg"
              >
                中古屋
              </Link>
              <Link
                href="/?type=租屋"
                className="px-4 py-2 text-secondary-700 hover:bg-secondary-50 rounded-lg"
              >
                租屋
              </Link>
              <Link
                href="/?type=土地"
                className="px-4 py-2 text-secondary-700 hover:bg-secondary-50 rounded-lg"
              >
                土地
              </Link>
              <Link
                href="/?type=店面"
                className="px-4 py-2 text-secondary-700 hover:bg-secondary-50 rounded-lg"
              >
                店面
              </Link>
              <Link
                href="/?type=辦公"
                className="px-4 py-2 text-secondary-700 hover:bg-secondary-50 rounded-lg"
              >
                辦公
              </Link>
              <Link
                href="/?type=廠房"
                className="px-4 py-2 text-secondary-700 hover:bg-secondary-50 rounded-lg"
              >
                廠房
              </Link>
              <Link
                href="/?type=社區"
                className="px-4 py-2 text-secondary-700 hover:bg-secondary-50 rounded-lg"
              >
                社區
              </Link>
              <Link
                href="/"
                className="px-4 py-2 text-secondary-700 hover:bg-secondary-50 rounded-lg"
              >
                找房
              </Link>
              <Link
                href="/interior-design"
                className="px-4 py-2 text-secondary-700 hover:bg-secondary-50 rounded-lg"
              >
                室內設計
              </Link>
              <Link
                href="/news"
                className="px-4 py-2 text-secondary-700 hover:bg-secondary-50 rounded-lg"
              >
                新聞
              </Link>
              <hr className="my-2 border-secondary-100" />
              <div className="px-4 py-2 text-secondary-500 text-xs font-semibold uppercase tracking-wider">
                功能
              </div>
              <Link
                href="/create"
                className="px-4 py-2 text-secondary-700 hover:bg-secondary-50 rounded-lg"
              >
                刊登房源
              </Link>
              <Link
                href="/pricing"
                className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg font-semibold"
              >
                收費標準
              </Link>
              <hr className="my-2 border-secondary-100" />
              {isAuthenticated ? (
                <>
                  <Link
                    href="/my-listings"
                    className="px-4 py-2 text-secondary-700 hover:bg-secondary-50 rounded-lg"
                  >
                    我的房源
                  </Link>
                  {user?.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg font-medium"
                    >
                      管理後台
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-secondary-700 hover:bg-secondary-50 rounded-lg text-left"
                  >
                    登出
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-secondary-700 hover:bg-secondary-50 rounded-lg"
                  >
                    登入
                  </Link>
                  <Link href="/register/role" className="btn-primary mx-4">
                    免費註冊
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}



