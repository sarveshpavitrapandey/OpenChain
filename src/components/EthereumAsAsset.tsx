
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  getEthPrice, 
  getEthStakingAPR, 
  calculateEthValue, 
  calculateStakingRewards 
} from '@/services/web3Service';
import { ArrowRight, Coins, TrendingUp, Clock } from 'lucide-react';

const EthereumAsAsset: React.FC = () => {
  const [ethPrice, setEthPrice] = useState<number | null>(null);
  const [stakingAPR, setStakingAPR] = useState<number | null>(null);
  const [ethAmount, setEthAmount] = useState<string>('1');
  const [months, setMonths] = useState<number>(12);
  const [usdValue, setUsdValue] = useState<number | null>(null);
  const [stakingRewards, setStakingRewards] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const price = await getEthPrice();
        const apr = await getEthStakingAPR();
        setEthPrice(price);
        setStakingAPR(apr);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching ETH data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const updateCalculations = async () => {
      if (ethAmount && !isNaN(Number(ethAmount))) {
        try {
          const value = await calculateEthValue(ethAmount);
          const rewards = await calculateStakingRewards(ethAmount, months);
          setUsdValue(value);
          setStakingRewards(rewards);
        } catch (error) {
          console.error('Error calculating values:', error);
        }
      }
    };

    updateCalculations();
  }, [ethAmount, months]);

  const handleEthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setEthAmount(value);
    }
  };

  const handleMonthsChange = (value: number[]) => {
    setMonths(value[0]);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-blue-500" />
            ETH Price
          </CardTitle>
          <CardDescription>
            Current market value of Ethereum
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse h-16 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
          ) : (
            <div className="text-4xl font-bold text-center my-6">
              ${ethPrice?.toLocaleString()}
            </div>
          )}
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          Data refreshes every 60 seconds
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            Staking Returns
          </CardTitle>
          <CardDescription>
            Current annual percentage rate
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse h-16 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
          ) : (
            <div className="text-4xl font-bold text-center my-6 text-emerald-600">
              {stakingAPR}%
            </div>
          )}
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          Ethereum Proof of Stake consensus mechanism
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-500" />
            Staking Calculator
          </CardTitle>
          <CardDescription>
            Estimate potential ETH earnings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="eth-amount">ETH Amount</Label>
            <Input
              id="eth-amount"
              type="text"
              value={ethAmount}
              onChange={handleEthChange}
              placeholder="Enter ETH amount"
            />
            {usdValue && (
              <p className="text-xs text-muted-foreground">
                ≈ ${usdValue.toLocaleString()} USD
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Staking Period</Label>
              <span className="text-sm font-medium">{months} months</span>
            </div>
            <Slider
              defaultValue={[12]}
              max={60}
              min={1}
              step={1}
              onValueChange={handleMonthsChange}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 month</span>
              <span>5 years</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <div className="flex items-center gap-2 mb-2">
            <ArrowRight className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-medium">Estimated reward:</span>
          </div>
          {stakingRewards !== null && (
            <div className="text-xl font-bold text-emerald-600">
              +{stakingRewards} ETH
              {usdValue && stakingRewards && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  (≈ ${(stakingRewards * (usdValue / Number(ethAmount))).toFixed(2)})
                </span>
              )}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default EthereumAsAsset;
