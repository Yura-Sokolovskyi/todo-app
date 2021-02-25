<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400"></a></p>

<p align="center">
<a href="https://travis-ci.org/laravel/framework"><img src="https://travis-ci.org/laravel/framework.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## Getting Started On Windows

1. Clone repo into local  directory.

2. Create database "todo_app".

3. Open terminal and go to the cloned repository local directory.

4. Rename file ".env.example" to ".env" and change setting for database connection.

5. Install composer

```bash
composer install
```
6. Generate application key 
```bash
php artisan key:generate
```
7. Run DB migrations (add "--ceed" to migrate with seeding)
```bash
php artisan migrate
```
8. Run local server
```bash
php artisan serve
