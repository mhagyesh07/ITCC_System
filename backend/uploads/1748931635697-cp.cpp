// #pragma GCC optimize("Ofast")
// #pragma GCC target("avx,avx2,fma")
// #pragma GCC optimization("unroll-loops")

#include<bits/stdc++.h>
#include<ext/pb_ds/assoc_container.hpp>
#include<ext/pb_ds/tree_policy.hpp>
using namespace __gnu_pbds;
using namespace std;

#define fastio() ios_base::sync_with_stdio(false);cin.tie(NULL);cout.tie(NULL)
#define int long long
#define ld long double 
#define inf 1e18
#define pb push_back
#define ppb pop_back()
#define eb emplace_back
#define ppc __builtin_popcount
#define parity(x) __builtin_parity(x) // gives true for odd and false for even
#define ppcll __builtin_popcountll
#define msb(x) 63-__builtin_clzll(x) // gives the most significant bit of the number
#define F first
#define S second
#define f(i,a,b) for(int i=a;i<b;i++)
#define Sort(a) sort(a.begin(),a.end())
#define all(x) (x).begin(),(x).end()
#define yes cout<<"YES\n"
#define no cout<<"NO\n"
#define nl "\n"
typedef pair<int,int>pii;
typedef vector<pair<int,int>>vpii;
typedef vector<int>vi;
typedef vector<vector<int>>vvi;
typedef map<int,int>mii;  
typedef map<int,vi>mvi;                    
typedef tree<int,null_type, greater<int>,rb_tree_tag, tree_order_statistics_node_update>pbds;
// *s.find_by_order(), order_of_key()
// order_of_key (val): returns the no. of values less than val
// find_by_order (k): returns the kth largest element. (0-based)

#ifndef ONLINE_JUDGE
#define debug(x) cerr << #x <<" "; _print(x); cerr << endl;
#else
#define debug(x)
#endif
void _print(int t) {cerr << t;}
void _print(string t) {cerr << t;}
void _print(char t) {cerr << t;}
void _print(long double t) {cerr << t;}
void _print(double t) {cerr << t;}
template <class T, class V> void _print(pair <T, V> p);
template <class T> void _print(vector <T> v);
template <class T> void _print(set <T> v);
template <class T, class V> void _print(map <T, V> v);
template <class T> void _print(multiset <T> v);
template <class T, class V> void _print(pair <T, V> p) {cerr << "{"; _print(p.F); cerr << ","; _print(p.S); cerr << "}";}
template <class T> void _print(vector <T> v) {cerr << "[ "; for (T i : v) {_print(i); cerr << " ";} cerr << "]";}
template <class T> void _print(set <T> v) {cerr << "[ "; for (T i : v) {_print(i); cerr << " ";} cerr << "]";}
template <class T> void _print(multiset <T> v) {cerr << "[ "; for (T i : v) {_print(i); cerr << " ";} cerr << "]";}
template <class T, class V> void _print(map <T, V> v) {cerr << "[ "; for (auto i : v) {_print(i); cerr << " ";} cerr << "]";}

/*-------------------------------------------------------------------------------------------------------------------------------------------------------*/
const int M=998244353;
void input(vi &a){ int n=a.size(); f(i,0,n) cin>>a[i]; }
int ciel(int a,int b){ return (a+b-1)/b; }
int gc(int a,int b){ while(b){ a%=b; swap(a,b); } return a; }

//sieve
// const int MAXN=1e6+5; 
// vector<bool>isprime(MAXN,1);
// vi primes;
// void sieve(int n)
// {   
//     isprime[0]=isprime[1]=0;
//     for(int i=2;i*i<=n;i++) 
//     {
//         if(isprime[i])
//         {
//             primes.pb(i); 
//             if(i*i<=n)
//             {
//                 for(int j=i*i;j<=n;j+=i) 
//                 {
//                     isprime[j]=0;
//                 }
//             }
//         }
//     }
// }

//prime factors 
mii primefactorization(int n)
{ 
    mii pfact; 
    while((n&1)==0)
    { 
        pfact[2]++; n/=2; 
    } 
    for(int i=3;i*i<=n;i+=2)
    { 
        while(n%i==0)
        { 
            pfact[i]++; n/=i; 
        }
    } 
    if(n>2)
    { 
        pfact[n]++; 
    } 
    return pfact; 
}

//mod ops
int mod(int x){ return (x%M+M)%M; }
int pls(int a,int b){ return mod(mod(a)+mod(b)); }
int mul(int a,int b){ return mod(mod(a)*mod(b)); }

// fast multi
int binMul(int a,int b)
{ int ans=0; while(b){ if(b&1){ ans=(ans+a)%M; } a=(a+a)%M; b>>=1; } return ans; }

int power(int a,int b)
{ int ans=1; while(b){ if(b&1) ans=binMul(ans,a); a=binMul(a,a); b>>=1; } return ans; }

// ncr 
// const int X=3*1e5+2;
// int fact[X];
// int minv[X];

// void precomp() // if n>=1e7 remove minv 
// { fact[0]=1; f(i,1,X){ fact[i]=(fact[i-1]*i)%M; } }

// int ncr(int n,int r) // int numo=fact[n],deno=(fact[r]*fact[n-r])%M; return mul(numo,power(deno,M-2));
// { if(n<0 || r<0 || r>n){ return 0; }                           
//     int numo=fact[n],deno=(fact[r]*fact[n-r])%M; return mul(numo,power(deno,M-2));
// }
/*-------------------------------------------------------------------------------------------------------------------------------------------------------*/

void solve() {//memset(dp,-1,sizeof(dp))
    int n;cin>>n;
    vi a(n),b(n);input(a); 
    input(b);
    map<int,vector<pii>>m;
    vi ans(n);
 
    f(i,0,n)
    {   
        m[a[i]].pb({i,1});
        m[b[i]].pb({i,2});
        auto it=m.rbegin();
        vpii t=it->S;
        int mx=-1,ix=-1,ar=0;
        f(j,0,t.size())
        {
            int arr=t[j].S;
            int dif=abs(i-t[j].F);
            if(arr==1)
            {
                if(b[dif]>mx)
                {
                    mx=b[dif];
                    ix=dif;
                    ar=1;
                }
            }
            else if(arr==2){
                if(a[dif]>mx)
                {
                    mx=a[dif];
                    ix=dif;
                    ar=2;
                }
            }
        }
        if(ar==1)
        {
            ans[i]=(power(2,b[ix])+power(2,a[abs(ix-i)]))%M;
        }
        else if(ar==2)
        {
            ans[i]=(power(2,a[ix])+power(2,b[abs(ix-i)]))%M;
        }
    }
    f(i,0,n) cout<<ans[i]<<" ";
    cout<<nl;
}


int32_t main(){
    fastio();
    #ifndef ONLINE_JUDGE
    freopen("Error.txt", "w", stderr);
    freopen("input.txt", "r", stdin);
    freopen("output.txt", "w", stdout);
    #endif
	cout << fixed << setprecision(25);
    int t=1; 
    cin>>t;
    while(t--) 
    solve();
    return 0;
}
