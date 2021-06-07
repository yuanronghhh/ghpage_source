{
  "title": "HTTPS 流程和生成过程",
  "profile": "HTTPS 生成过程",
  "create_at": "2021-02-06T12:40:00",
  "update_at": "2021-02-06T12:40:00"
}
# HTTPS 流程和生成过程

## 前言
`HTTPS` 为 `HTTP`+`TLS`的意思, `TLS`是一种加密算法合集, 里面有很多中算法, 比如
以及`AES`,`MD5`,`AES`等算法. 而我们经常使用`SSH`远程登录的时候,则使用的是`RSA`算法,


## 原理
在数学中,有一类函数,正向计算很容易, 但反向计算很困难, 只有给出函数后门,
才能快速计算出结果, 数学里面将这一类函数称之为单项陷们函数。
所以人们利用这种特性,设计了非对称加密算法。

非对称加密, 就是利用上述数学原理, 使用算法生成在加密软件中生成的两个钥匙,
并具有以下这些特点:
1. 公钥和私钥地位平等, 是算法中的两个因子, 均可用于加密和解密, 但一般公钥公开,私钥不公开。
2. 公钥加密的数据,仅有对应的私钥可以解密, 私钥加密的数据,也仅有对应公钥也可以解密。
3. 密钥也携带了签名, 主体单位，国家，公开加密算法, 密钥大小等信息。

## 流程
> 注意: 理解流程比后面生成算法更重要,生成的脚本将在最后整体给出

### 疑问
在说明流程之前, 我们需要思考一下一个问题, 假设有`A`,`B`两个人, 如果`B`要寄信,
但不希望邮局`C`知晓内容,如何做到?

我们的答案可以是这样的:
1. `A`可以制作一个箱子, 处于打开状态, 让邮局寄过去,
2. `B`收到箱子, 写完信后,放入箱子,合上. 寄回箱子即可.
3. 邮局没有钥匙,无法打开,便无法知晓内容.

上面例子, 如果对应到计算机中, `箱子`就如`公钥`,`钥匙`就如`私钥`, 
每个人能免费获得他人的箱子, 但无法得到钥匙就无从知晓内容.

> 这里对称加密也可以做到，但非对称加密相比对称加密就是，在得到密文+加密算法
的情况下，非对称加密无法解开，而对称加密，很有可能因为密码长度不够而被暴力破解。

### 计算机中流程
像上面这样的流程，在计算机中, 因为密钥对是由软件生成
所以, 上面的流程便变成了这样:
1. `A` 通过加密软件生成公钥和私钥,公钥公开.
2. `B` 知晓公钥后,使用公钥加密内容,仅有`A`的私钥可以解密`密文B`.
3. `B` 通过邮局`C`寄出`密文A`给`A`即可.

### 中间人攻击
上面的过程中, 我们的公钥在安全传输网络下也许可行, 但是, 中间人`C`永远在中间,
而明文传输下, 中间人`C`也可以生成公钥和私钥对的, 可以将`A公钥`替换成自己的`C公钥`,
同样,也可以将`B`传给`A`的公钥改成自己的`C公钥`, 达到中间监听信息的目的.这样就实现了
常见的中间人攻击.

### CA机构

为了解决中间人攻击问题, 我们需要引入另外一个机构, 来保障公钥传输安全, 
这个机构叫就做`CA`,
`CA`机构, 是用来做数字签名的机构, 全称是 `Certificate Authority`, 
它和`A`为信任关系, 主要就是保证公钥的安全传输.

简单来说, `CA`机构的工作, 就是使用自己的`私钥`, 加密服务器`A`生成的公钥, 
来保证`A`的公钥能安全传给`B`, 其中`CA`的公钥一般预装到了客户电脑上.

于是流程变成了这样:
1. `A`和`CA机构`均通过加密软件生成密钥对.
2. `A`将公钥通过安全路径提交到`CA机构`, 这里说明一下,实际为了方便加密,事先需要`A`
   携带用途,域名等信息给`CA机构`,所以需要`A`生成明文证书请求文件(`A-csr.pem`),
   这里证书请求文件 `A-csr` = (`A-pubkey` + `server-info`).
3. `CA`使用自己(`ca-privkey.pem`)私钥加密`A`的公钥,外加自己的信息,打包成服务端证书,
   生成`A-crt.pem`. 然后将证书颁发给`A`, 由`A`配置服务器请求证书.
   这里的证书 A-crt = ca私钥加密(A公钥) + ca信息;
4. 因为需要解密上面的`A-crt`证书, `B`需要通过安全路径, 比如预装到操作系统等方法,
   获取到`CA`机构公钥.
5. 当`B`需要通讯时, `A`首先将`A-crt`证书,发送出来, 因为没有`CA机构`私钥,
   中间人`C`擅自修改的话,会导致`B`无法用`CA公钥`解出`A公钥`,放弃通讯, 所以只能原样传输,
   保证了`A公钥`传输安全.
6. `B`拿到`A-crt`证书, 使用第4步预装的安全`CA公钥`,解出`A公钥`, 然后使用`A公钥`
   加密自己的`B公钥`传送给`A`, 这样双方均安全地拿到了对方公钥, 即可安全传输.

通过中间`CA机构`保障,`A`和`B`双方安全交换了对方公钥, 
实际过程中,上面过程略有不同, 主要有以下几个方面:
1. 因为非对称加密计算量比较大, 所以一般在交换公钥对后, 双方会协商随机数, 使用
   对称加密进行数据的传输, 因此`https`传输过程中, 存在对称和非对称两种方式.
2. `CA机构`虽然预装到大家电脑,但`CA机构`一般使用`信任链`管理, 即`根证书`信任`CA1`
   `CA1`信任`CA2`,那么`CA2`颁布的证书也将被信任.

## 脚本生成

下面是生成`https`的整个过程的演示脚本, 脚本分别新建了三个文件夹
`ca/`, `server/` 以及`client/` 文件夹, 操作也分别在不同文件夹中进行.

> 注意: 
> - 下面脚本中如果要生成自签名证书, 可以直接将`ca`相关的私钥和公钥换成`server`端
    相关的密钥对操作即可.
> - 请注意修改相关`openssl.cnf`配置路径.

### 总流程脚本
```bash
#!/bin/bash

###
# 参考文章
# https://blog.csdn.net/oh_on/article/details/78301297
###
# read -p "pause" novar  # for debug

server_dir=${PWD}"/server"
client_dir=${PWD}"/client"
ca_dir=${PWD}"/ca"
nginx_dir="${HOME}/.config/nginx"

# ------------------------------- 预备处理 -------------------------------------------
## 服务端私/公钥 生成
cd ${server_dir}
# openssl genrsa -out server-privkey.pem 2048
# openssl rsa -in server-privkey.pem -pubout -out server-pubkey.pem


## ca的私/公钥 生成
cd ${ca_dir}
# openssl genrsa -out ca-privkey.pem 2048
# openssl rsa -in ca-privkey.pem -pubout -out ca-pubkey.pem

## 生成根ca证书
ca_subj="/OU=Demo Root CA/C=CN/ST=GuangDong/O=Demo Ca Organization/CN=Demo Root CA"
openssl req -config ./ca-openssl.cnf -new -key ca-privkey.pem -out ca-csr.pem -subj "${ca_subj}"
# CA生成 根证书文件
openssl x509 -req -days 3650 -in ca-csr.pem -signkey ca-privkey.pem -out ca-crt.pem
# ## 格式转换
# # openssl pkcs12 -export -clcerts -in ca-crt.pem -inkey ca-privkey.pem -out ca-pkcs12.p12

## 客户端私/公钥 BS不需要使用, 可能App端会使用
cd ${client_dir}
# openssl genrsa -out client-privkey.pem 2048
# openssl rsa -in client-privkey.pem -pubout -out client-pubkey.pem

## ------------------------------ 服务端操作 -----------------------------------------
cd ${server_dir}
# 生成证书请求文件 && 提交证书给CA

# 此处O=Demo Ca Organization要求一致
# CN (Common Name:共用名), O (Organization:组织), OU(Organization Unit:组织单位), 
# ST(State:城市), C(Country:国家或地区) 
# 由于 Chrome 检查使用 DNS subjectAltName 的 SAN 扩展, 所以必须开启才不警告
server_subj="/OU=Demo Server/C=CN/ST=GuangDong/O=Demo Server Organization/CN=localhost"
openssl req -config ./server-openssl.cnf -reqexts v3_req -extensions v3_req -new \
  -key server-privkey.pem -out server-csr.pem -subj "${server_subj}"
cp ${server_dir}/server-csr.pem ${ca_dir}/server-csr.pem
# openssl req -noout -text -in server-csr.pem # 查看证书请求文件详情

## ------------------------------ CA端操作 -------------------------------------------
cd ${ca_dir}
# ca 颁发证书
truncate --size 0 index.txt
openssl ca -config ./ca-openssl.cnf -policy policy_anything -extensions v3_req -days 3650 \
  -key ca-privkey.pem -cert ca-crt.pem \
  -in server-csr.pem -out server-crt.pem

# openssl x509 -in server-crt.pem -noout -text  # 查看证书详情

# openssl x509 -req -days 3650 -in server-csr.pem -CA ca-crt.pem -CAkey ca-privkey.pem \
#   -CAcreateserial -signkey ca-privkey.pem -out server-crt.pem

cp ${ca_dir}/server-crt.pem ${server_dir}/server-crt.pem

## ------------------------------ 服务端操作 -------------------------------------------
cd ${server_dir}
# 服务端 配置nginx证书
# ssl_certificate  ca-crt.pem
# ssl_certificate_key  server-privkey.pem  # 用于解密
sudo nginx -s reload

## ------------------------------ 客户端操作 -------------------------------------------
cd ${client_dir}
# 客户端访问 https 地址, 发现不受信任
curl -v 'https://localhost'

# 客户端需要安装根证书, 火狐不读取新加系统证书, 需要另外导入证书.
cp ${ca_dir}/ca-crt.pem ${client_dir}/ca-crt.pem
```

### `ca`的`openssl`生成时的配置
```bash
# OpenSSL example configuration file.
# This is mostly being used for generation of certificate requests.
#

# Note that you can include other files from the main configuration
# file using the .include directive.
#.include filename

# This definition stops the following lines choking if HOME isn't
# defined.
HOME			  = .
# RANDFILE		= $ENV::HOME/.rnd

# Extra OBJECT IDENTIFIER info:
#oid_file		= $ENV::HOME/.oid
oid_section		= new_oids

# To use this configuration file with the "-extfile" option of the
# "openssl x509" utility, name here the section containing the
# X.509v3 extensions to use:
# extensions		=
# (Alternatively, use a configuration file that has only
# X.509v3 extensions in its main [= default] section.)

[ new_oids ]

# We can add new OIDs in here for use by 'ca', 'req' and 'ts'.
# Add a simple OID like this:
# testoid1=1.2.3.4
# Or use config file substitution like this:
# testoid2=${testoid1}.5.6

# Policies used by the TSA examples.
tsa_policy1 = 1.2.3.4.1
tsa_policy2 = 1.2.3.4.5.6
tsa_policy3 = 1.2.3.4.5.7

####################################################################
[ ca ]
default_ca	= CA_default		# The default ca section

####################################################################
[ CA_default ]

dir		    = "/mnt/U_DISK/demo/ca" 	# Where everything is kept
certs		  = $dir/certs		# Where the issued certs are kept
crl_dir		= $dir/crl		# Where the issued crl are kept
database	= $dir/index.txt	# database index file.
#unique_subject	= no			# Set to 'no' to allow creation of
					# several certs with same subject.
new_certs_dir	= $dir/newcerts		# default place for new certs.

certificate	= $dir/ca-crt.pem 	# The CA certificate
serial		= $dir/serial 		# The current serial number
crlnumber	= $dir/crlnumber	# the current crl number
					# must be commented out to leave a V1 CRL
crl		= $dir/crl.pem 		# The current CRL
private_key	= $dir/ca-privkey.pem # The private key
# RANDFILE    = $dir/private/.rand

x509_extensions	= usr_cert		# The extensions to add to the cert

# Comment out the following two lines for the "traditional"
# (and highly broken) format.
name_opt 	= ca_default		# Subject Name options
cert_opt 	= ca_default		# Certificate field options

# Extension copying option: use with caution.
# copy_extensions = copy

# Extensions to add to a CRL. Note: Netscape communicator chokes on V2 CRLs
# so this is commented out by default to leave a V1 CRL.
# crlnumber must also be commented out to leave a V1 CRL.
# crl_extensions	= crl_ext

default_days	= 365			# how long to certify for
default_crl_days= 30			# how long before next CRL
default_md	= default		# use public key default MD
preserve	= no			# keep passed DN ordering

# A few difference way of specifying how similar the request should look
# For type CA, the listed attributes must be the same, and the optional
# and supplied fields are just that :-)
policy		= policy_match

# For the CA policy
[ policy_match ]
countryName		= match
stateOrProvinceName	= match
organizationName	= match
organizationalUnitName	= optional
commonName		= supplied
emailAddress		= optional

# For the 'anything' policy
# At this point in time, you must list all acceptable 'object'
# types.
[ policy_anything ]
countryName		= optional
stateOrProvinceName	= optional
localityName		= optional
organizationName	= optional
organizationalUnitName	= optional
commonName		= supplied
emailAddress		= optional

####################################################################
[ req ]
default_bits		= 2048
default_keyfile 	= privkey.pem
distinguished_name	= req_distinguished_name
attributes		= req_attributes
x509_extensions	= v3_ca	# The extensions to add to the self signed cert
req_extensions = v3_req

# Passwords for private keys if not present they will be prompted for
# input_password = secret
# output_password = secret

# This sets a mask for permitted string types. There are several options.
# default: PrintableString, T61String, BMPString.
# pkix	 : PrintableString, BMPString (PKIX recommendation before 2004)
# utf8only: only UTF8Strings (PKIX recommendation after 2004).
# nombstr : PrintableString, T61String (no BMPStrings or UTF8Strings).
# MASK:XXXX a literal mask value.
# WARNING: ancient versions of Netscape crash on BMPStrings or UTF8Strings.
string_mask = utf8only

[ req_distinguished_name ]
countryName			= Country Name (2 letter code)
countryName_default		= CN
countryName_min			= 2
countryName_max			= 2

stateOrProvinceName		= State or Province Name (full name)
stateOrProvinceName_default	= Some-State

localityName			= Locality Name (eg, city)

0.organizationName		= Organization Name (eg, company)
0.organizationName_default	= Internet Widgits Pty Ltd

# we can do this but it is not needed normally :-)
#1.organizationName		= Second Organization Name (eg, company)
#1.organizationName_default	= World Wide Web Pty Ltd

organizationalUnitName		= Organizational Unit Name (eg, section)
#organizationalUnitName_default	=

commonName			= Common Name (e.g. server FQDN or YOUR name)
commonName_max			= 64

emailAddress			= Email Address
emailAddress_max		= 64

# SET-ex3			= SET extension number 3

[ req_attributes ]
challengePassword		= A challenge password
challengePassword_min		= 4
challengePassword_max		= 20

unstructuredName		= An optional company name

[ usr_cert ]

# These extensions are added when 'ca' signs a request.

# This goes against PKIX guidelines but some CAs do it and some software
# requires this to avoid interpreting an end user certificate as a CA.

basicConstraints=CA:FALSE

# Here are some examples of the usage of nsCertType. If it is omitted
# the certificate can be used for anything *except* object signing.

# This is OK for an SSL server.
# nsCertType			= server

# For an object signing certificate this would be used.
# nsCertType = objsign

# For normal client use this is typical
# nsCertType = client, email

# and for everything including object signing:
# nsCertType = client, email, objsign

# This is typical in keyUsage for a client certificate.
# keyUsage = nonRepudiation, digitalSignature, keyEncipherment

# This will be displayed in Netscape's comment listbox.
nsComment			= "OpenSSL Generated Certificate"

# PKIX recommendations harmless if included in all certificates.
subjectKeyIdentifier=hash
authorityKeyIdentifier=keyid,issuer

# This stuff is for subjectAltName and issuerAltname.
# Import the email address.
# subjectAltName=email:copy
# An alternative to produce certificates that aren't
# deprecated according to PKIX.
# subjectAltName=email:move

# Copy subject details
# issuerAltName=issuer:copy

#nsCaRevocationUrl		= http://www.domain.dom/ca-crl.pem
#nsBaseUrl
#nsRevocationUrl
#nsRenewalUrl
#nsCaPolicyUrl
#nsSslServerName

# This is required for TSA certificates.
# extendedKeyUsage = critical,timeStamping

[ v3_req ]

basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
subjectAltName = @alt_names

[ v3_ca ]


# Extensions for a typical CA


# PKIX recommendation.

subjectKeyIdentifier=hash

authorityKeyIdentifier=keyid:always,issuer

basicConstraints = critical,CA:true

# Key usage: this is typical for a CA certificate. However since it will
# prevent it being used as an test self-signed certificate it is best
# left out by default.
# keyUsage = cRLSign, keyCertSign

# Some might want this also
# nsCertType = sslCA, emailCA

# Include email address in subject alt name: another PKIX recommendation
subjectAltName=email:copy
# Copy issuer details
issuerAltName=issuer:copy

# DER hex encoding of an extension: beware experts only!
# obj=DER:02:03
# Where 'obj' is a standard or added object
# You can even override a supported extension:
# basicConstraints= critical, DER:30:03:01:01:FF

[ crl_ext ]

# CRL extensions.
# Only issuerAltName and authorityKeyIdentifier make any sense in a CRL.

# issuerAltName=issuer:copy
authorityKeyIdentifier=keyid:always

[ proxy_cert_ext ]
# These extensions should be added when creating a proxy certificate

# This goes against PKIX guidelines but some CAs do it and some software
# requires this to avoid interpreting an end user certificate as a CA.

basicConstraints=CA:FALSE

# Here are some examples of the usage of nsCertType. If it is omitted
# the certificate can be used for anything *except* object signing.

# This is OK for an SSL server.
# nsCertType			= server

# For an object signing certificate this would be used.
# nsCertType = objsign

# For normal client use this is typical
# nsCertType = client, email

# and for everything including object signing:
# nsCertType = client, email, objsign

# This is typical in keyUsage for a client certificate.
# keyUsage = nonRepudiation, digitalSignature, keyEncipherment

# This will be displayed in Netscape's comment listbox.
nsComment			= "OpenSSL Generated Certificate"

# PKIX recommendations harmless if included in all certificates.
subjectKeyIdentifier=hash
authorityKeyIdentifier=keyid,issuer

# This stuff is for subjectAltName and issuerAltname.
# Import the email address.
# subjectAltName=email:copy
# An alternative to produce certificates that aren't
# deprecated according to PKIX.
# subjectAltName=email:move

# Copy subject details
# issuerAltName=issuer:copy

#nsCaRevocationUrl		= http://www.domain.dom/ca-crl.pem
#nsBaseUrl
#nsRevocationUrl
#nsRenewalUrl
#nsCaPolicyUrl
#nsSslServerName

# This really needs to be in place for it to be a proxy certificate.
proxyCertInfo=critical,language:id-ppl-anyLanguage,pathlen:3,policy:foo

####################################################################
[ tsa ]

default_tsa = tsa_config1	# the default TSA section

[ tsa_config1 ]

# These are used by the TSA reply generation only.
dir		= ./demoCA		# TSA root directory
serial		= $dir/tsaserial	# The current serial number (mandatory)
crypto_device	= builtin		# OpenSSL engine to use for signing
signer_cert	= $dir/tsacert.pem 	# The TSA signing certificate
					# (optional)
certs		= $dir/ca-crt.pem	# Certificate chain to include in reply
					# (optional)
signer_key	= $dir/private/tsakey.pem # The TSA private key (optional)
signer_digest  = sha256			# Signing digest to use. (Optional)
default_policy	= tsa_policy1		# Policy if request did not specify it
					# (optional)
other_policies	= tsa_policy2, tsa_policy3	# acceptable policies (optional)
digests     = sha1, sha256, sha384, sha512  # Acceptable message digests (mandatory)
accuracy	= secs:1, millisecs:500, microsecs:100	# (optional)
clock_precision_digits  = 0	# number of digits after dot. (optional)
ordering		= yes	# Is ordering defined for timestamps?
				# (optional, default: no)
tsa_name		= yes	# Must the TSA name be included in the reply?
				# (optional, default: no)
ess_cert_id_chain	= no	# Must the ESS cert id chain be included?
				# (optional, default: no)
ess_cert_id_alg		= sha1	# algorithm to compute certificate
				# identifier (optional, default: sha1)

[ alt_names ]
# DNS.1 = localhost
# IP.1 = 192.168.56.1
DNS.1 = www.localhost
DNS.2 = web.localhost
DNS.3 = app.localhost
```
### 服务端(server) 的 `openssl` 生成时的配置
```bash
#
# OpenSSL example configuration file.
# This is mostly being used for generation of certificate requests.
#

# Note that you can include other files from the main configuration
# file using the .include directive.
#.include filename

# This definition stops the following lines choking if HOME isn't
# defined.
HOME			  = .
# RANDFILE		= $ENV::HOME/.rnd

# Extra OBJECT IDENTIFIER info:
#oid_file		= $ENV::HOME/.oid
oid_section		= new_oids

# To use this configuration file with the "-extfile" option of the
# "openssl x509" utility, name here the section containing the
# X.509v3 extensions to use:
# extensions		=
# (Alternatively, use a configuration file that has only
# X.509v3 extensions in its main [= default] section.)

[ new_oids ]

# We can add new OIDs in here for use by 'ca', 'req' and 'ts'.
# Add a simple OID like this:
# testoid1=1.2.3.4
# Or use config file substitution like this:
# testoid2=${testoid1}.5.6

# Policies used by the TSA examples.
tsa_policy1 = 1.2.3.4.1
tsa_policy2 = 1.2.3.4.5.6
tsa_policy3 = 1.2.3.4.5.7

####################################################################
[ ca ]
default_ca	= CA_default		# The default ca section

####################################################################
[ CA_default ]

dir		    = "/mnt/U_DISK/demo/server" 	# Where everything is kept
certs		  = $dir/certs		# Where the issued certs are kept
crl_dir		= $dir/crl		# Where the issued crl are kept
database	= $dir/index.txt	# database index file.
#unique_subject	= no			# Set to 'no' to allow creation of
					# several certs with same subject.
new_certs_dir	= $dir/newcerts		# default place for new certs.

certificate	= $dir/ca-crt.pem 	# The CA certificate
serial		= $dir/serial 		# The current serial number
crlnumber	= $dir/crlnumber	# the current crl number
					# must be commented out to leave a V1 CRL
crl		= $dir/crl.pem 		# The current CRL
private_key	= $dir/ca-privkey.pem # The private key
# RANDFILE    = $dir/private/.rand

x509_extensions	= usr_cert		# The extensions to add to the cert

# Comment out the following two lines for the "traditional"
# (and highly broken) format.
name_opt 	= ca_default		# Subject Name options
cert_opt 	= ca_default		# Certificate field options

# Extension copying option: use with caution.
# copy_extensions = copy

# Extensions to add to a CRL. Note: Netscape communicator chokes on V2 CRLs
# so this is commented out by default to leave a V1 CRL.
# crlnumber must also be commented out to leave a V1 CRL.
# crl_extensions	= crl_ext

default_days	= 365			# how long to certify for
default_crl_days= 30			# how long before next CRL
default_md	= default		# use public key default MD
preserve	= no			# keep passed DN ordering

# A few difference way of specifying how similar the request should look
# For type CA, the listed attributes must be the same, and the optional
# and supplied fields are just that :-)
policy		= policy_match

# For the CA policy
[ policy_match ]
countryName		= match
stateOrProvinceName	= match
organizationName	= match
organizationalUnitName	= optional
commonName		= supplied
emailAddress		= optional

# For the 'anything' policy
# At this point in time, you must list all acceptable 'object'
# types.
[ policy_anything ]
countryName		= optional
stateOrProvinceName	= optional
localityName		= optional
organizationName	= optional
organizationalUnitName	= optional
commonName		= supplied
emailAddress		= optional

####################################################################
[ req ]
default_bits		= 2048
default_keyfile 	= privkey.pem
distinguished_name	= req_distinguished_name
attributes		= req_attributes
x509_extensions	= v3_ca	# The extensions to add to the self signed cert
req_extensions = v3_req

# Passwords for private keys if not present they will be prompted for
# input_password = secret
# output_password = secret

# This sets a mask for permitted string types. There are several options.
# default: PrintableString, T61String, BMPString.
# pkix	 : PrintableString, BMPString (PKIX recommendation before 2004)
# utf8only: only UTF8Strings (PKIX recommendation after 2004).
# nombstr : PrintableString, T61String (no BMPStrings or UTF8Strings).
# MASK:XXXX a literal mask value.
# WARNING: ancient versions of Netscape crash on BMPStrings or UTF8Strings.
string_mask = utf8only

[ req_distinguished_name ]
countryName			= Country Name (2 letter code)
countryName_default		= AU
countryName_min			= 2
countryName_max			= 2

stateOrProvinceName		= State or Province Name (full name)
stateOrProvinceName_default	= Some-State

localityName			= Locality Name (eg, city)

0.organizationName		= Organization Name (eg, company)
0.organizationName_default	= Internet Widgits Pty Ltd

# we can do this but it is not needed normally :-)
#1.organizationName		= Second Organization Name (eg, company)
#1.organizationName_default	= World Wide Web Pty Ltd

organizationalUnitName		= Organizational Unit Name (eg, section)
#organizationalUnitName_default	=

commonName			= Common Name (e.g. server FQDN or YOUR name)
commonName_max			= 64

emailAddress			= Email Address
emailAddress_max		= 64

# SET-ex3			= SET extension number 3

[ req_attributes ]
challengePassword		= A challenge password
challengePassword_min		= 4
challengePassword_max		= 20

unstructuredName		= An optional company name

[ usr_cert ]

# These extensions are added when 'ca' signs a request.

# This goes against PKIX guidelines but some CAs do it and some software
# requires this to avoid interpreting an end user certificate as a CA.

basicConstraints=CA:FALSE

# Here are some examples of the usage of nsCertType. If it is omitted
# the certificate can be used for anything *except* object signing.

# This is OK for an SSL server.
# nsCertType			= server

# For an object signing certificate this would be used.
# nsCertType = objsign

# For normal client use this is typical
# nsCertType = client, email

# and for everything including object signing:
# nsCertType = client, email, objsign

# This is typical in keyUsage for a client certificate.
# keyUsage = nonRepudiation, digitalSignature, keyEncipherment

# This will be displayed in Netscape's comment listbox.
nsComment			= "OpenSSL Generated Certificate"

# PKIX recommendations harmless if included in all certificates.
subjectKeyIdentifier=hash
authorityKeyIdentifier=keyid,issuer

# This stuff is for subjectAltName and issuerAltname.
# Import the email address.
# subjectAltName=email:copy
# An alternative to produce certificates that aren't
# deprecated according to PKIX.
# subjectAltName=email:move

# Copy subject details
# issuerAltName=issuer:copy

#nsCaRevocationUrl		= http://www.domain.dom/ca-crl.pem
#nsBaseUrl
#nsRevocationUrl
#nsRenewalUrl
#nsCaPolicyUrl
#nsSslServerName

# This is required for TSA certificates.
# extendedKeyUsage = critical,timeStamping

[ v3_req ]

# Extensions to add to a certificate request

basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
subjectAltName = @alt_names

[ v3_ca ]


# Extensions for a typical CA


# PKIX recommendation.

subjectKeyIdentifier=hash

authorityKeyIdentifier=keyid:always,issuer

basicConstraints = critical,CA:true

# Key usage: this is typical for a CA certificate. However since it will
# prevent it being used as an test self-signed certificate it is best
# left out by default.
# keyUsage = cRLSign, keyCertSign

# Some might want this also
# nsCertType = sslCA, emailCA

# Include email address in subject alt name: another PKIX recommendation
# subjectAltName=email:copy
# Copy issuer details
# issuerAltName=issuer:copy

# DER hex encoding of an extension: beware experts only!
# obj=DER:02:03
# Where 'obj' is a standard or added object
# You can even override a supported extension:
# basicConstraints= critical, DER:30:03:01:01:FF

[ crl_ext ]

# CRL extensions.
# Only issuerAltName and authorityKeyIdentifier make any sense in a CRL.

# issuerAltName=issuer:copy
authorityKeyIdentifier=keyid:always

[ proxy_cert_ext ]
# These extensions should be added when creating a proxy certificate

# This goes against PKIX guidelines but some CAs do it and some software
# requires this to avoid interpreting an end user certificate as a CA.

basicConstraints=CA:FALSE

# Here are some examples of the usage of nsCertType. If it is omitted
# the certificate can be used for anything *except* object signing.

# This is OK for an SSL server.
# nsCertType			= server

# For an object signing certificate this would be used.
# nsCertType = objsign

# For normal client use this is typical
# nsCertType = client, email

# and for everything including object signing:
# nsCertType = client, email, objsign

# This is typical in keyUsage for a client certificate.
# keyUsage = nonRepudiation, digitalSignature, keyEncipherment

# This will be displayed in Netscape's comment listbox.
nsComment			= "OpenSSL Generated Certificate"

# PKIX recommendations harmless if included in all certificates.
subjectKeyIdentifier=hash
authorityKeyIdentifier=keyid,issuer

# This stuff is for subjectAltName and issuerAltname.
# Import the email address.
# subjectAltName=email:copy
# An alternative to produce certificates that aren't
# deprecated according to PKIX.
# subjectAltName=email:move

# Copy subject details
# issuerAltName=issuer:copy

#nsCaRevocationUrl		= http://www.domain.dom/ca-crl.pem
#nsBaseUrl
#nsRevocationUrl
#nsRenewalUrl
#nsCaPolicyUrl
#nsSslServerName

# This really needs to be in place for it to be a proxy certificate.
proxyCertInfo=critical,language:id-ppl-anyLanguage,pathlen:3,policy:foo

####################################################################
[ tsa ]

default_tsa = tsa_config1	# the default TSA section

[ tsa_config1 ]

# These are used by the TSA reply generation only.
dir		= ./demoCA		# TSA root directory
serial		= $dir/tsaserial	# The current serial number (mandatory)
crypto_device	= builtin		# OpenSSL engine to use for signing
signer_cert	= $dir/tsacert.pem 	# The TSA signing certificate
					# (optional)
certs		= $dir/ca-crt.pem	# Certificate chain to include in reply
					# (optional)
signer_key	= $dir/private/tsakey.pem # The TSA private key (optional)
signer_digest  = sha256			# Signing digest to use. (Optional)
default_policy	= tsa_policy1		# Policy if request did not specify it
					# (optional)
other_policies	= tsa_policy2, tsa_policy3	# acceptable policies (optional)
digests     = sha1, sha256, sha384, sha512  # Acceptable message digests (mandatory)
accuracy	= secs:1, millisecs:500, microsecs:100	# (optional)
clock_precision_digits  = 0	# number of digits after dot. (optional)
ordering		= yes	# Is ordering defined for timestamps?
				# (optional, default: no)
tsa_name		= yes	# Must the TSA name be included in the reply?
				# (optional, default: no)
ess_cert_id_chain	= no	# Must the ESS cert id chain be included?
				# (optional, default: no)
ess_cert_id_alg		= sha1	# algorithm to compute certificate
				# identifier (optional, default: sha1)

[ alt_names ]
DNS.1 = www.localhost
IP.1 = 127.0.0.1

```

## 常见问题
1. `firefox` 无法仍然出现警告 ?
答: `firefox`浏览器不读取`windows`系统中新加的自己生成的证书, 因此, 导入自己证书到系统后,
需要在`firefox`证书目录再导入一次.

2. `chrome` 出现告警, `其他浏览器` 却没有出现告警 ?
答: 因为`chrome`采用`v3_req`  扩展验证, 在生成证书过程中,`server-openssl.cnf` 配置
里面, `v3_req`需要带上`subjectAltName=@alt_names`, 然后,填入配置
```
# 命令行生成带参数
# -reqexts v3_req -extensions v3_req
# 配置文件需要类似下面内容, 域名自配置

[ v3_req ]
subjectAltName = @alt_names

[ alt_names ]
# DNS.1 = localhost
# IP.1 = 192.168.56.1
DNS.1 = www.localhost
DNS.2 = web.localhost
DNS.3 = app.localhost
```

## 概念说明

- `单项陷们函数`:
指数学里面一些正向计算很容易, 但反向计算很困难的函数, 但给出陷门后,
才可计算反向的结果, 可以书写成`x = f^(-1)(y)` 很困难, 但`y = f(x)`很容易.

- `RSA`算法原理: 大整数难以分解成两个质数乘积, 但给出质数一个因子很容易计算结果.

- `MD5`算法: 这是一个哈希算法, 通过数据填充,分组循环变换,拼接输出,得到一个不可逆字符串.

- 哈希算法: `hash`算法 是计算散列的算法是一个合集, 其中有`SHA-1`, `SHA-2`, `MD5`等诸多算法. 
常见用于以下情况:

1. 密码加密, 因为用户传输的是密码, 只要`hash`散列加密后一致即可, 而因为不可逆,
即使数据库泄漏, 或者软件给到代理商, 代理商也无法破解客户密码.
2. 大量数据精确查找, 比如 `redis键值对`, `glib字典`这样的数据结构, 可以将字符串转换为数字, 
可以在大数据时, 更快查找精确的数据, 但模糊匹配数据就不行了. 比如下面是`glib`里面
计算字符串键的散列函数.
```c
guint
g_str_hash (gconstpointer v)
{
  const signed char *p;
  guint32 h = 5381;

  for (p = v; *p != '\0'; p++)
    h = (h << 5) + h + *p;

  return h;
}
```
> 这里`5381`为经验测试所得，可以将字符均衡地分布到`hash`表上面。
