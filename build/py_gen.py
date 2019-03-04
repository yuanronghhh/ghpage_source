import sys
import os
from pathlib import Path
import time
import json


tags = ["RECORD", "DEVELOP", "ABOUT"]
article_path = "./static/articles"
write_path = "./static/articles/list.json"


class GenArticles:
    # def float_to_datetime(self, stamp):
    #     gm = time.localtime(stamp)
    #     return "%4.4d-%.2d-%.2dT%.2d:%.2d:%.2d" % (gm.tm_year,
    #                                                gm.tm_mon,
    #                                                gm.tm_mday,
    #                                                gm.tm_hour,
    #                                                gm.tm_min,
    #                                                gm.tm_sec)

    def get_article_profile(self, fpath):
        """
        {
            "title": "Git\u7b14\u8bb0",
            "profile": "Git\u662f\u4e00\u4e2a\u5206\u5e03\u5f0f\u7248\u672c\u63a7\u5236\u7cfb\u7edf(vcs)\u3002",
            "create_at": "2017-03-10T12:10:01",
            "update_at": "2017-03-10T12:10:01",
            "path": "static/articles/develop/git/learn_git.md"
        }
        """
        data = ''
        f = open(fpath.as_posix(), "r", encoding="utf-8")
        first = True

        while True:
            line = f.readline()
            if first and line.find("{") == -1:
                break
            first = False

            data += line
            if line.find("}") > -1:
                break

        if not data:
            return {}

        return json.loads(data, encoding="utf-8")

    def get_file_info(self, fpath):
        if not fpath.exists():
            return

        info = self.get_article_profile(fpath)
        info.update({
            "path": fpath.as_posix()
        })

        return info

    def scan_path(self, wk):
        ap = Path(wk)

        if not ap.exists():
            return

        article_list = {}
        for dp, dns, fns in os.walk(ap):
            dpt = Path(dp)

            tg = dpt.name.upper()
            if tg in tags:

                for dpn, dnsn, fnsn in os.walk(dpt):
                    for f in fnsn:
                        fnm = Path(dpn).joinpath(f)
                        if fnm.suffix == '.md':
                            finfo = self.get_file_info(fnm)
                            if "title" not in finfo:
                                continue

                            if tg in article_list:
                                article_list[tg].append(finfo)
                            else:
                                article_list[tg] = [finfo]

        return article_list

    def gen_index(self):
        al = self.scan_path(article_path)
        with open(write_path, "w", encoding="utf-8") as f:
            f.write(json.dumps(al, indent=2))

ga = GenArticles()
ga.gen_index()
