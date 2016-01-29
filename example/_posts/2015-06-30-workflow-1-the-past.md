---
layout: posts
title: Workflow pt. 1 - the Old Way
author: Alex
date: 2015-06-30
published: yes
---

## Workflow pt. 1
### ...on the old way of doing things

It used to be (in what some *might* be tempted to call the Good 'Ol Days) that all it took to start developing for the web was an `index.html` file. Then we started getting fancy: maybe we need a separate stylesheet, how about some external JavaScript, maybe some extra assets... and then things got complex. Not bad, by any means, just more complex. The barriers to entry have risen a bit, but that's better for the web in general. Even if we have to give up glorious the [glorious websites of the 90's](http://www.warnerbros.com/archive/spacejam/movie/jam.htm) in the process, it's nice to know that standards across the Web are, in general, being raised.

Part of that move to a faster, cleaner, more robust Web requires more focus on process when developing. One person can't possibly hope to remain competitive in the WebDev space while coding every feature by hand or subjecting themselves to an antiquated build routine. This series on workflow (a three-parter, if I can keep myself from rambling too much) will go over my personal experience with workflow improvement for modern web development. We'll start with my process of yesteryear (and the process by which I pushed the first version of this site) in this post, then cover my current toolkit and build routine in part two, and finally take a look at what will be coming up next in making my personal process more effective, efficient, and enjoyable. Hopefully my journey from process-to-process will be helpful for you as well. Whether it's a positive or negative example, I hope you at least learn something.

The needs of this site are pretty basic, all things considered. There's a jekyll-generated blog directory (featured in posts 1 and 2 on Blog Tech) containing basic markdown, YAML, and html files. There weren't very many HTML files, and only one CSS file for style. The only JavaScript this blog needed was a bit of script at the bottom of the `body` tag to help with scrolling. And that was it! Very simple, and very familiar to novice web designers and aspiring web developers.

At this point, all development was done on [Cloud9 IDE](https://c9.io), a cloud-based development environment that gives users access to Ubuntu terminals, a full(ish)-featured text editor, a basic JavaScript REPL, and live browser previews. It's a fantastic environment that I still use when I'm on the road or looking to loaf around on the couch. Since Cloud9 gives you installation access for your local Ubuntu instance, I was able to use git and GitHub for version control without too much trouble, as well as Linux's built-in SFTP tool for uploading to my web server (hosted at [nearlyfreespeech.net](https://www.nearlyfreespeech.net/)).

It was a simple, lightweight set up and I'd recommend it for anyone starting out building lightweight, static sites.

---

But not everything was hunky-dory with this setup. While I was getting pretty comfortable with the flow of working on new features or content on separate git branches, merging completed work into the master branch, and pushing directly to my hosted site using SFTP, there were three big wrenches that got thrown into this workflow almost immediately:

1. Page Speed... Google was, of course, telling me to minify, uglify, GZip, and cache all of my HTML, CSS, and JavaScript resources.
2. After about 4 copy->pastes of page content into different HTML documents (an about page, a resume page, and so on), I decided I wanted to change some things, as we are all wont to do. Which, was, of course, by that point, a real pain. Especially as the single CSS stylesheet governing all of those styles got to be more cumbersome.
3. Of course I started adding more JavaScript to the site, and I thought that integrating jQuery + some plugins would be nice. And it was, but it was also a pain to manage all of those plugins, modules, and dependencies.

The latter two were issues that I managed by lots of careful refactoring and organization for a while. Those issues continued to compound as I made bigger and bigger sites with more and more people, and their solutions will be discussed in detail in the next installment. For the moment, just know that it's doable to manage the second and third issues with care, rigid naming conventions, and absolute control over your entire code base.

The first set of issues, though, took some finagling. Of course, individually processing each file would be a huge pain, as would keeping my official deployment build mixed in with my development branch. It gets a little messy with all of the min.js, .html.gz, and combined files. To combat that issue I started two main branches in git: 'master' and 'optimized'. Master was nice and pretty: just raw HTML, CSS, and JavaScript. Optimized was where all files were minified and zipped.

At this point I should back up a bit. Some of you might have seen GZip and thought "Why don't you just enable compression on your server through your hosting provider?". While that's an option for some folks, there's two reason's why that wasn't going to work. The first: nearlyfreespeech.net said I couldn't, and they didn't have the kind of control panel that would let you implement those modules server-side anyway. The second, and more important: there are some real serious issues with enabling [mod_deflate](http://httpd.apache.org/docs/2.2/mod/mod_deflate.html) on Apache servers. Most important of thos issues is that mod_deflate initiates a new request to compress served files each time someone tries to access the files. So while Google might not yell at you, your server would rather just serve up ready-made GZip files. So why wouldn't you?

The reason you wouldn't is that it can be a bit of a pain to zip up every HTML, CSS, and JavaScript file that is served to the end user. My solution was two-pronged. First, we I needed to change some of the default settings on nearlyfreespeech's Apache server using a special file in the root directory called `.htaccess`. Inside that file, I have the following:


```
RewriteEngine on
RewriteCond %{HTTP:Accept-Encoding} gzip
RewriteCond %{REQUEST_FILENAME}.gz -f
RewriteRule ^(.*)$ $1.gz [L]
```

It basically says, "If the browser accepts .gzip files, send them a .gzip, otherwise send them the regular ol' HTML, CSS, or JS file." Now it's just up to us to make sure that every text file has a .gz equivalent.

To solve that problem, I used the solution given in [this post from LeMoDa](http://www.lemoda.net/mod_rewrite/gzip-static/index.html). I uploaded the following perl script to a document in the root directory of the optimized branch of my site:

{% highlight perl %}
#!/usr/local/bin/perl
use warnings;
use strict;
# Set $verbose to a true value if you need to debug this script.
my $verbose;
use File::Find;
find (\&wanted, ("."));
sub wanted
{
    if (/(.*\.(?:html|css|js)$)/) {
        my $gz = "$_.gz";
        if (-f $gz) {
            if (age ($_) <= age ($gz)) {
                if ($verbose) {
                    print "Don't need to compress $_\n";
                }
                return;
            }
        }
        if ($verbose) {
            print "Compressing $_\n";
        }
        # The following substitution is for the case that the file
        # name contains double quotation marks ".
        $_ =~ s/"/\\"/g;
        # Now compress the file.
        system ("gzip --keep --best --force \"$_\"");
    }
    else {
        if ($verbose) {
            print "Rejecting $_\n";
        }
    }
}

# This returns the age of the file.

sub age
{
    my ($file) = @_;
    my @stat = stat $file;
    return $stat[9];
}
{% endhighlight %}

It might look intimidating, but it's pretty simple in practice. Running `perl [filename].pl` from the command-line will search through every file in your directory tree and create a GZipped version right next to the original file. From there, it's a matter of firing up SFTP from the console, putting in host and username information, and using `put -r [directory or file]` to upload the zipped and unzipped contents of a directory.

All of this can easily be done within the Cloud9 workspace, too. The problem (besides the latter issues mentioned above) gets to be the tedium at times. `git checkout optimized` + `git merge master` + `perl compressor.pl` + `git add .` + `git commit -m "Commit message"` + `git push origin optimized` + `sftp [username]@[hostname]` + `put [filename]` + `put -r [directory name]` is a long operation for every single push. Add in a command-line [minifier and uglifier](https://developers.google.com/speed/docs/insights/MinifyResources?hl=en) before compression, and you've got quite the set of tasks to run before you can call the job done.

If only there were some sort of *task runner* that we could use to speed up the process. Stay tuned for the next post about workflow to learn how we might automate the processes above. Until then, have fun compressing assets from the command line!
